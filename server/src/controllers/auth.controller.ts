import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';

// In-memory store for password reset tokens for simplicity (or use DB fields if preferred)
// Let's store them in-memory for quick demonstration or we can just send it.
const resetTokens = new Map<string, { email: string; expires: number }>();

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Conflict', message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user along with profile, default credits (50), default free subscription, default settings
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        profile: {
          create: {}
        },
        credit: {
          create: {
            balance: 50,
            dailyCredits: 5,
            monthlyCredits: 50
          }
        },
        subscription: {
          create: {
            plan: 'FREE',
            status: 'active'
          }
        },
        settings: {
          create: {
            darkMode: true
          }
        }
      },
      include: {
        profile: true,
        credit: true,
        subscription: true
      }
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
        credit: user.credit,
        subscription: user.subscription
      },
      accessToken,
      refreshToken
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        credit: true,
        subscription: true
      }
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
        credit: user.credit,
        subscription: user.subscription
      },
      accessToken,
      refreshToken
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Validation Error', message: 'Refresh token is required' });
  }

  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired refresh token' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
    }

    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Validation Error', message: 'Email is required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, don't disclose that the email wasn't found
      return res.status(200).json({ message: 'If the email exists, a password reset link has been sent' });
    }

    // Generate simple reset token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    resetTokens.set(token, {
      email,
      expires: Date.now() + 3600000 // 1 hour expiration
    });

    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    console.log(`[Email Mock Service] Password reset link for ${email}: ${resetLink}`);

    return res.status(200).json({
      message: 'If the email exists, a password reset link has been sent',
      // In production, do not return the link in the API response. Send via email.
      // Returning it here facilitates easy local testing.
      resetLinkForTesting: resetLink
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Validation Error', message: 'Token and new password are required' });
  }

  const tokenData = resetTokens.get(token);
  if (!tokenData || tokenData.expires < Date.now()) {
    return res.status(400).json({ error: 'Bad Request', message: 'Invalid or expired reset token' });
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: tokenData.email },
      data: { passwordHash }
    });

    // Invalidate token
    resetTokens.delete(token);

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Validation Error', message: 'Current and new passwords are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Bad Request', message: 'Incorrect current password' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function deleteAccount(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function getProfile(req: Request, res: Response) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        profile: true,
        credit: true,
        subscription: true,
        settings: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function updateProfile(req: Request, res: Response) {
  const userId = req.user?.id;
  const { name, bio, jobTitle, phone, website, location, darkMode } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        profile: {
          update: {
            bio,
            jobTitle,
            phone,
            website,
            location
          }
        },
        settings: darkMode !== undefined ? {
          update: {
            darkMode
          }
        } : undefined
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        profile: true,
        credit: true,
        subscription: true,
        settings: true
      }
    });

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

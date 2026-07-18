import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteAccount,
  getProfile,
  updateProfile
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes (requireAuth)
router.post('/change-password', requireAuth, changePassword);
router.delete('/delete-account', requireAuth, deleteAccount);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;

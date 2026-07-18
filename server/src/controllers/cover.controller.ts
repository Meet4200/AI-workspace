import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { generateCoverLetter } from '../services/llm.service.js';

export async function getCoverLetters(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const letters = await prisma.coverLetter.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    return res.status(200).json({ letters });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function getCoverLetterById(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const letter = await prisma.coverLetter.findFirst({
      where: { id, userId }
    });

    if (!letter) {
      return res.status(404).json({ error: 'Not Found', message: 'Cover letter not found' });
    }

    return res.status(200).json({ letter });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function createCoverLetter(req: Request, res: Response) {
  const userId = req.user?.id;
  const { companyName, roleTitle, jobDescription, tone, length } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!companyName || !roleTitle || !jobDescription) {
    return res.status(400).json({ error: 'Validation Error', message: 'Company name, role, and job description are required' });
  }

  try {
    // Check credits
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (credit && credit.balance < 3) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient credits (3 credits required)' });
    }

    // Call AI service to generate content
    const content = await generateCoverLetter({
      companyName,
      roleTitle,
      jobDescription,
      tone: tone || 'professional',
      length: length || 'medium'
    });

    const letter = await prisma.coverLetter.create({
      data: {
        userId,
        title: `Cover Letter - ${companyName} (${roleTitle})`,
        companyName,
        roleTitle,
        jobDescription,
        tone: tone || 'professional',
        length: length || 'medium',
        content
      }
    });

    // Deduct credits and log history
    if (credit) {
      await prisma.credit.update({
        where: { userId },
        data: { balance: { decrement: 3 } }
      });

      await prisma.history.create({
        data: {
          userId,
          module: 'COVER_LETTER',
          action: 'GENERATE',
          creditsUsed: 3
        }
      });
    }

    return res.status(201).json({ letter });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function updateCoverLetter(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, companyName, roleTitle, jobDescription, tone, length, content } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const letter = await prisma.coverLetter.findFirst({
      where: { id, userId }
    });

    if (!letter) {
      return res.status(404).json({ error: 'Not Found', message: 'Cover letter not found' });
    }

    const updated = await prisma.coverLetter.update({
      where: { id },
      data: {
        title,
        companyName,
        roleTitle,
        jobDescription,
        tone,
        length,
        content
      }
    });

    return res.status(200).json({ letter: updated });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function deleteCoverLetter(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const letter = await prisma.coverLetter.findFirst({
      where: { id, userId }
    });

    if (!letter) {
      return res.status(404).json({ error: 'Not Found', message: 'Cover letter not found' });
    }

    await prisma.coverLetter.delete({ where: { id } });
    return res.status(200).json({ message: 'Cover letter deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

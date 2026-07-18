import { Request, Response } from 'express';
import prisma from '../config/db.js';
import { generateEmail, improveEmail, translateEmail } from '../services/llm.service.js';

export async function getEmails(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const emails = await prisma.email.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    return res.status(200).json({ emails });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function getEmailById(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const email = await prisma.email.findFirst({
      where: { id, userId }
    });

    if (!email) {
      return res.status(404).json({ error: 'Not Found', message: 'Email draft not found' });
    }

    return res.status(200).json({ email });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function createEmail(req: Request, res: Response) {
  const userId = req.user?.id;
  const { purpose, tone, recipient, bodyInput } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!purpose || !bodyInput) {
    return res.status(400).json({ error: 'Validation Error', message: 'Purpose and email context are required' });
  }

  try {
    // Check user credits
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (credit && credit.balance < 2) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient credits (2 credits required)' });
    }

    // Call LLM
    const body = await generateEmail({
      purpose,
      tone: tone || 'professional',
      recipient,
      bodyInput
    });

    const subject = `AI Draft: ${purpose.replace('_', ' ').toUpperCase()}`;

    const email = await prisma.email.create({
      data: {
        userId,
        subject,
        body,
        recipient,
        purpose,
        tone: tone || 'professional'
      }
    });

    // Deduct credits
    if (credit) {
      await prisma.credit.update({
        where: { userId },
        data: { balance: { decrement: 2 } }
      });

      await prisma.history.create({
        data: {
          userId,
          module: 'EMAIL',
          action: 'GENERATE',
          creditsUsed: 2
        }
      });
    }

    return res.status(201).json({ email });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function updateEmail(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { subject, body, recipient, purpose, tone } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const email = await prisma.email.findFirst({
      where: { id, userId }
    });

    if (!email) {
      return res.status(404).json({ error: 'Not Found', message: 'Email draft not found' });
    }

    const updated = await prisma.email.update({
      where: { id },
      data: {
        subject,
        body,
        recipient,
        purpose,
        tone
      }
    });

    return res.status(200).json({ email: updated });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function deleteEmail(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const email = await prisma.email.findFirst({
      where: { id, userId }
    });

    if (!email) {
      return res.status(404).json({ error: 'Not Found', message: 'Email draft not found' });
    }

    await prisma.email.delete({ where: { id } });
    return res.status(200).json({ message: 'Email draft deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

// AI helpers
export async function improveEmailAPI(req: Request, res: Response) {
  const { text, tone } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text content is required' });
  }
  try {
    const improved = await improveEmail(text, tone || 'professional');
    return res.status(200).json({ improved });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function translateEmailAPI(req: Request, res: Response) {
  const { text, language } = req.body;
  if (!text || !language) {
    return res.status(400).json({ error: 'Text and target language are required' });
  }
  try {
    const translated = await translateEmail(text, language);
    return res.status(200).json({ translated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

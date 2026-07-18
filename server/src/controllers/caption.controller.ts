import { Request, Response } from 'express';
import prisma from '../config/db.js';

export async function getCaptions(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const list = await prisma.caption.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ captions: list });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function generateCaption(req: Request, res: Response) {
  const userId = req.user?.id;
  const { imageUrl } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Check credits
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (credit && credit.balance < 2) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient credits (2 credits required)' });
    }

    const instaText = `🚀 Coding the future with React + Vite! Sleek UI, hot updates, and instant loads. #Fullstack #SaaS #BuildInPublic`;
    const linkedInText = `Chasing bugs, refactoring schemas, and building scalability. One line at a time. 💻✨`;
    const twitterText = `Design system in place. Code compiles. Database migrations green. Today was a good day. 📊☕`;

    const hashtags = ['Fullstack', 'SaaS', 'BuildInPublic', 'Coding'];

    const caption = await prisma.caption.create({
      data: {
        userId,
        imageUrl: imageUrl || '/uploads/code.jpg',
        instaText,
        linkedInText,
        twitterText,
        hashtags
      }
    });

    // Deduct credit
    if (credit) {
      await prisma.credit.update({
        where: { userId },
        data: { balance: { decrement: 2 } }
      });

      await prisma.history.create({
        data: {
          userId,
          module: 'CAPTION',
          action: 'GENERATE',
          creditsUsed: 2
        }
      });
    }

    return res.status(201).json({ caption });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

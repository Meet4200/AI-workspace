import { Request, Response } from 'express';
import prisma from '../config/db.js';

export async function getInterviews(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const list = await prisma.interviewHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ interviews: list });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function generateQuestions(req: Request, res: Response) {
  const { roleTitle } = req.body;
  const sampleQuestions = [
    "Explain the difference between JWT Access and Refresh tokens, and how you prevent session hijacking.",
    "How does PostgreSQL handle relational indexing for rapid multi-table queries?",
    "Describe a challenging front-end optimization task you solved using React Query or caching."
  ];

  return res.status(200).json({ roleTitle: roleTitle || 'Software Engineer', questions: sampleQuestions });
}

export async function submitInterview(req: Request, res: Response) {
  const userId = req.user?.id;
  const { roleTitle, questions, answers } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Check credits
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (credit && credit.balance < 5) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient credits (5 credits required)' });
    }

    const transcriptQA = (questions || []).map((q: string, idx: number) => {
      return {
        question: q,
        answer: (answers || [])[idx] || '',
        evaluation: 'Strong technical content. Emphasized industry standards and security best practices.'
      };
    });

    const suggestions = [
      "Incorporate more quantitative metrics in your technical answers.",
      "Consider using the STAR format for describing challenging front-end caching structures."
    ];

    const interview = await prisma.interviewHistory.create({
      data: {
        userId,
        position: roleTitle || 'Software Engineer',
        transcript: transcriptQA as any,
        suggestions: suggestions as any,
        confidenceScore: 85,
        communicationScore: 90
      }
    });

    // Deduct credit
    if (credit) {
      await prisma.credit.update({
        where: { userId },
        data: { balance: { decrement: 5 } }
      });

      await prisma.history.create({
        data: {
          userId,
          module: 'INTERVIEW',
          action: 'GENERATE',
          creditsUsed: 5
        }
      });
    }

    return res.status(201).json({ interview });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

import { Request, Response } from 'express';
import prisma from '../config/db.js';

export async function getMeetings(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const meetings = await prisma.meeting.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ meetings });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function createMeeting(req: Request, res: Response) {
  const userId = req.user?.id;
  const { title, audioUrl } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Check credits
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (credit && credit.balance < 4) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient credits (4 credits required)' });
    }

    const mockTranscript = `Speaker 1: Welcome everyone. Today we are aligning on the IntelliDesk launch.
Speaker 2: I have finished the RAG PDF modules. The search index works locally.
Speaker 1: Excellent. Let's ensure we build production bundles and test the login.
Speaker 2: Yes, I will verify the JWT headers. Let's meet tomorrow to review.`;

    const mockSummary = "The team aligned on the launch plan of IntelliDesk AI. Major progress includes completing the local PDF RAG chat indices. The next immediate step is to test production token refresh headers.";
    const mockActionItems = [
      "Test production token refresh headers (Assignee: Developer)",
      "Prepare production builds and verify database constraints (Assignee: Lead)"
    ];

    const meeting = await prisma.meeting.create({
      data: {
        userId,
        title: title || 'Untitled Meeting Notes',
        audioUrl: audioUrl || '/uploads/meeting.wav',
        transcript: mockTranscript,
        summary: mockSummary,
        actionItems: mockActionItems as any
      }
    });

    // Deduct credits
    if (credit) {
      await prisma.credit.update({
        where: { userId },
        data: { balance: { decrement: 4 } }
      });

      await prisma.history.create({
        data: {
          userId,
          module: 'MEETING',
          action: 'GENERATE',
          creditsUsed: 4
        }
      });
    }

    return res.status(201).json({ meeting });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function deleteMeeting(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const meeting = await prisma.meeting.findFirst({ where: { id, userId } });
    if (!meeting) {
      return res.status(404).json({ error: 'Not Found', message: 'Meeting not found' });
    }

    await prisma.meeting.delete({ where: { id } });
    return res.status(200).json({ message: 'Meeting notes deleted' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

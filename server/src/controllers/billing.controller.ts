import { Request, Response } from 'express';
import prisma from '../config/db.js';

export async function getPayments(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const list = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ payments: list });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function buyCreditsPackage(req: Request, res: Response) {
  const userId = req.user?.id;
  const { creditAmount, priceInCents } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Add credits to user credit balance immediately
    const credit = await prisma.credit.update({
      where: { userId },
      data: { balance: { increment: Number(creditAmount || 100) } }
    });

    // Save payment log
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: Number(priceInCents || 1000),
        currency: 'usd',
        status: 'paid',
        stripeInvoiceId: `inv_${Math.random().toString(36).substring(2, 9)}`
      }
    });

    return res.status(201).json({ credit, payment });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

import { Request, Response } from 'express';
import prisma from '../config/db.js';

export async function getAdminStats(req: Request, res: Response) {
  try {
    const userCount = await prisma.user.count();
    const payments = await prisma.payment.findMany();
    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

    const moduleStats = await prisma.history.groupBy({
      by: ['module'],
      _sum: {
        creditsUsed: true
      }
    });

    return res.status(200).json({
      users: userCount,
      revenueInCents: totalRevenue,
      transactions: payments.length,
      modules: moduleStats
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function getAdminUsers(req: Request, res: Response) {
  try {
    const list = await prisma.user.findMany({
      include: {
        profile: true,
        credit: true,
        subscription: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ users: list });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function updateAdminUserRole(req: Request, res: Response) {
  const { userId, role } = req.body;
  if (!userId || !role) {
    return res.status(400).json({ error: 'User ID and Role are required' });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    return res.status(200).json({ user: updated });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

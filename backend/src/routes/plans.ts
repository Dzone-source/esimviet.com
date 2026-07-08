import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { country_id, country_slug } = req.query;

    const where: Record<string, unknown> = { is_active: true };

    if (country_id) {
      where.country_id = parseInt(country_id as string);
    }

    if (country_slug) {
      where.country = { slug: country_slug as string };
    }

    const plans = await prisma.plan.findMany({
      where,
      include: {
        country: { select: { name: true, slug: true, flag: true } },
      },
      orderBy: [{ price: 'asc' }],
    });

    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(req.params.id), is_active: true },
      include: {
        country: true,
      },
    });

    if (!plan) throw createError('Plan not found', 404);
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, region, popular } = req.query;

    const where: Record<string, unknown> = { is_active: true };
    if (search) {
      where.name = { contains: search as string };
    }
    if (region) {
      where.region = region as string;
    }
    if (popular === 'true') {
      where.is_popular = true;
    }

    const countries = await prisma.country.findMany({
      where,
      include: {
        _count: { select: { plans: { where: { is_active: true } } } },
      },
      orderBy: [{ is_popular: 'desc' }, { name: 'asc' }],
    });

    res.json({ success: true, data: countries });
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const country = await prisma.country.findUnique({
      where: { slug: req.params.slug, is_active: true },
      include: {
        plans: {
          where: { is_active: true },
          orderBy: [{ days: 'asc' }, { price: 'asc' }],
        },
      },
    });

    if (!country) throw createError('Country not found', 404);
    res.json({ success: true, data: country });
  } catch (error) {
    next(error);
  }
});

export default router;

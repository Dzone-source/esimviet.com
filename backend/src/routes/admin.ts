import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../utils/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { uploadCover } from '../middleware/upload';
import { createError } from '../middleware/errorHandler';
import { OrderStatus } from '@prisma/client';

const router = Router();

router.use(authenticate, requireAdmin);

// ─── DASHBOARD STATS ─────────────────────────────────────────────
router.get('/stats', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalOrders, paidOrders, pendingOrders, waitingOrders, completedOrders, totalRevenue, countriesCount, plansCount] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'Paid' } }),
      prisma.order.count({ where: { status: 'Pending' } }),
      prisma.order.count({ where: { status: 'WaitingUpload' } }),
      prisma.order.count({ where: { status: 'Completed' } }),
      prisma.order.aggregate({
        where: { status: { in: ['Paid', 'WaitingUpload', 'Completed'] } },
        _sum: { total: true },
      }),
      prisma.country.count({ where: { is_active: true } }),
      prisma.plan.count({ where: { is_active: true } }),
    ]);

    // Revenue last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await prisma.order.findMany({
      where: {
        status: { in: ['Paid', 'WaitingUpload', 'Completed'] },
        paid_at: { gte: sevenDaysAgo },
      },
      select: { paid_at: true, total: true },
      orderBy: { paid_at: 'asc' },
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        paidOrders,
        pendingOrders,
        waitingOrders,
        completedOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        countriesCount,
        plansCount,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── ORDERS ─────────────────────────────────────────────────────
router.get('/orders', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: Record<string, unknown> = {};
    if (status) where.status = status as OrderStatus;
    if (search) {
      where.OR = [
        { order_number: { contains: search as string } },
        { customer_name: { contains: search as string } },
        { customer_email: { contains: search as string } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          order_items: {
            include: {
              plan: { include: { country: true } },
              esim_codes: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/orders/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        order_items: {
          include: {
            plan: { include: { country: true } },
            esim_codes: true,
          },
        },
      },
    });
    if (!order) throw createError('Order not found', 404);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.patch('/orders/:id/status', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Paid', 'WaitingUpload', 'Completed', 'Cancelled', 'Refunded'];
    if (!validStatuses.includes(status)) throw createError('Invalid status', 400);

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status: status as OrderStatus },
    });
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// ─── COUNTRIES ────────────────────────────────────────────────────
router.get('/countries', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const countries = await prisma.country.findMany({
      include: { _count: { select: { plans: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: countries });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/countries',
  uploadCover.single('cover_image'),
  [
    body('name').trim().notEmpty(),
    body('slug').trim().notEmpty(),
    body('flag').trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const { name, slug, flag, region, is_popular } = req.body;
      const coverImage = req.file ? `/uploads/covers/${req.file.filename}` : null;

      const country = await prisma.country.create({
        data: {
          name,
          slug,
          flag,
          region: region || null,
          is_popular: is_popular === 'true',
          cover_image: coverImage,
        },
      });
      res.status(201).json({ success: true, data: country });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/countries/:id',
  uploadCover.single('cover_image'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, slug, flag, region, is_popular, is_active } = req.body;
      const coverImage = req.file ? `/uploads/covers/${req.file.filename}` : undefined;

      const data: Record<string, unknown> = {};
      if (name) data.name = name;
      if (slug) data.slug = slug;
      if (flag) data.flag = flag;
      if (region !== undefined) data.region = region;
      if (is_popular !== undefined) data.is_popular = is_popular === 'true';
      if (is_active !== undefined) data.is_active = is_active === 'true';
      if (coverImage) data.cover_image = coverImage;

      const country = await prisma.country.update({
        where: { id: parseInt(req.params.id) },
        data,
      });
      res.json({ success: true, data: country });
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/countries/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.country.update({
      where: { id: parseInt(req.params.id) },
      data: { is_active: false },
    });
    res.json({ success: true, message: 'Country deactivated' });
  } catch (error) {
    next(error);
  }
});

// ─── PLANS ────────────────────────────────────────────────────────
router.get('/plans', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plans = await prisma.plan.findMany({
      include: { country: true },
      orderBy: [{ country_id: 'asc' }, { price: 'asc' }],
    });
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/plans',
  [
    body('country_id').isInt({ min: 1 }),
    body('title').trim().notEmpty(),
    body('days').isInt({ min: 1 }),
    body('data_amount').trim().notEmpty(),
    body('price').isFloat({ min: 0.01 }),
    body('network').trim().notEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const { country_id, title, days, data_amount, price, description, network, hotspot, speed } = req.body;

      const plan = await prisma.plan.create({
        data: {
          country_id: parseInt(country_id),
          title,
          days: parseInt(days),
          data_amount,
          price: parseFloat(price),
          description: description || null,
          network,
          hotspot: hotspot === 'true' || hotspot === true,
          speed: speed || null,
        },
        include: { country: true },
      });

      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      next(error);
    }
  }
);

router.put('/plans/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, days, data_amount, price, description, network, hotspot, speed, is_active } = req.body;
    const data: Record<string, unknown> = {};

    if (title) data.title = title;
    if (days) data.days = parseInt(days);
    if (data_amount) data.data_amount = data_amount;
    if (price) data.price = parseFloat(price);
    if (description !== undefined) data.description = description;
    if (network) data.network = network;
    if (hotspot !== undefined) data.hotspot = hotspot === 'true' || hotspot === true;
    if (speed !== undefined) data.speed = speed;
    if (is_active !== undefined) data.is_active = is_active === 'true' || is_active === true;

    const plan = await prisma.plan.update({
      where: { id: parseInt(req.params.id) },
      data,
      include: { country: true },
    });
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
});

router.delete('/plans/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.plan.update({
      where: { id: parseInt(req.params.id) },
      data: { is_active: false },
    });
    res.json({ success: true, message: 'Plan deactivated' });
  } catch (error) {
    next(error);
  }
});

export default router;

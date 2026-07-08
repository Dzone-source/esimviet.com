import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public settings (site name, etc.)
router.get('/public', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const publicKeys = ['site_name', 'logo', 'facebook', 'contact_email'];
    const settings = await prisma.setting.findMany({
      where: { key: { in: publicKeys } },
    });
    const data = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Admin: get all settings
router.get('/', authenticate, requireAdmin, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await prisma.setting.findMany();
    const data = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Admin: update settings
router.put('/', authenticate, requireAdmin, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updates = req.body as Record<string, string>;

    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    );

    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    next(error);
  }
});

export default router;

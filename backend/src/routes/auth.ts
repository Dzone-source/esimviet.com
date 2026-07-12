import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { authCookieHeader, clearAuthCookieHeader } from '../utils/token';

const router = Router();

router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const { username, password } = req.body;
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw createError('Invalid credentials', 401);
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      res.setHeader('Set-Cookie', authCookieHeader(token));
      res.json({
        success: true,
        token,
        user: { id: user.id, username: user.username, role: user.role },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, username: true, role: true, created_at: true },
    });
    if (!user) throw createError('User not found', 404);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (_req: Request, res: Response): void => {
  res.setHeader('Set-Cookie', clearAuthCookieHeader());
  res.json({ success: true });
});

router.put(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        throw createError('Current password is incorrect', 400);
      }
      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
      res.json({ success: true, message: 'Password updated' });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/account',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const { currentPassword, username, newPassword } = req.body;
      const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        throw createError('Current password is incorrect', 400);
      }

      if (!username && !newPassword) {
        throw createError('Provide a new username and/or new password', 400);
      }

      if (username && username !== user.username) {
        const taken = await prisma.user.findUnique({ where: { username } });
        if (taken) {
          throw createError('Username is already taken', 400);
        }
      }

      const data: { username?: string; password?: string } = {};
      if (username && username !== user.username) {
        data.username = username;
      }
      if (newPassword) {
        data.password = await bcrypt.hash(newPassword, 12);
      }

      const updated = await prisma.user.update({
        where: { id: user.id },
        data,
        select: { id: true, username: true, role: true },
      });

      res.json({
        success: true,
        message: 'Account updated',
        user: updated,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

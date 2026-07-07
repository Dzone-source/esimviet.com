import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { uploadQR } from '../middleware/upload';
import { createError } from '../middleware/errorHandler';
import { sendEsimDeliveryEmail } from '../services/email';
import { logger } from '../utils/logger';
import path from 'path';

const router = Router();

// Admin: Upload eSIM code for an order item
router.post(
  '/upload/:orderItemId',
  authenticate,
  requireAdmin,
  uploadQR.single('qr_image'),
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderItemId = parseInt(req.params.orderItemId);
      const { activation_code, manual_code } = req.body;

      const orderItem = await prisma.orderItem.findUnique({
        where: { id: orderItemId },
        include: {
          order: true,
          plan: { include: { country: true } },
        },
      });

      if (!orderItem) throw createError('Order item not found', 404);
      if (!activation_code) throw createError('Activation code required', 400);

      const qrImagePath = req.file
        ? `/uploads/qrcodes/${req.file.filename}`
        : undefined;

      // Create eSIM code record
      const esimCode = await prisma.esimCode.create({
        data: {
          plan_id: orderItem.plan_id,
          activation_code,
          manual_code: manual_code || null,
          qr_image: qrImagePath || null,
          status: 'sold',
          assigned_order: orderItem.order_id,
          order_item_id: orderItemId,
        },
      });

      // Update order status to Completed
      await prisma.order.update({
        where: { id: orderItem.order_id },
        data: { status: 'Completed' },
      });

      // Send delivery email
      try {
        const absoluteQrPath = qrImagePath
          ? path.join(process.cwd(), qrImagePath)
          : undefined;

        await sendEsimDeliveryEmail({
          orderNumber: orderItem.order.order_number,
          customerName: orderItem.order.customer_name,
          customerEmail: orderItem.order.customer_email,
          planTitle: orderItem.plan.title,
          countryName: orderItem.plan.country.name,
          days: orderItem.plan.days,
          dataAmount: orderItem.plan.data_amount,
          network: orderItem.plan.network,
          activationCode: activation_code,
          manualCode: manual_code,
          qrImagePath: absoluteQrPath,
        });
      } catch (emailError) {
        logger.error('Failed to send eSIM delivery email:', emailError);
      }

      res.json({
        success: true,
        message: 'eSIM uploaded and email sent to customer',
        data: esimCode,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: Get eSIM codes for an order
router.get(
  '/order/:orderId',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const codes = await prisma.esimCode.findMany({
        where: { assigned_order: parseInt(req.params.orderId) },
        include: {
          plan: { include: { country: true } },
        },
      });
      res.json({ success: true, data: codes });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

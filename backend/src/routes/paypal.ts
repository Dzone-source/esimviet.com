import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';
import { capturePayPalOrder, verifyPayPalOrder } from '../services/paypal';
import { sendOrderConfirmationEmail } from '../services/email';
import { logger } from '../utils/logger';

const router = Router();

router.post(
  '/capture',
  [
    body('paypalOrderId').notEmpty().withMessage('PayPal order ID required'),
    body('orderNumber').notEmpty().withMessage('Order number required'),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const { paypalOrderId, orderNumber } = req.body;

      // Find the order
      const order = await prisma.order.findUnique({
        where: { order_number: orderNumber },
        include: {
          order_items: {
            include: {
              plan: { include: { country: true } },
            },
          },
        },
      });

      if (!order) throw createError('Order not found', 404);
      if (order.status !== 'Pending') {
        res.json({ success: true, message: 'Order already processed', data: { status: order.status } });
        return;
      }

      // Verify the PayPal order matches
      if (order.paypal_order_id !== paypalOrderId) {
        throw createError('PayPal order ID mismatch', 400);
      }

      // Capture payment server-side
      const captureResult = await capturePayPalOrder(paypalOrderId);

      if (captureResult.status !== 'COMPLETED') {
        throw createError(`Payment not completed: ${captureResult.status}`, 400);
      }

      // Verify amount
      const capturedAmount = parseFloat(
        captureResult.purchase_units[0]?.payments?.captures?.[0]?.amount?.value || '0'
      );

      if (Math.abs(capturedAmount - parseFloat(order.total.toString())) > 0.01) {
        logger.error(`Amount mismatch for order ${orderNumber}: expected ${order.total}, got ${capturedAmount}`);
        throw createError('Payment amount mismatch', 400);
      }

      // Update order status
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'WaitingUpload',
          paid_at: new Date(),
        },
      });

      // Send confirmation email
      try {
        const item = order.order_items[0];
        await sendOrderConfirmationEmail({
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          planTitle: item.plan.title,
          countryName: item.plan.country.name,
          days: item.plan.days,
          dataAmount: item.plan.data_amount,
          total: parseFloat(order.total.toString()),
          quantity: item.qty,
        });
      } catch (emailError) {
        logger.error('Failed to send confirmation email:', emailError);
      }

      res.json({
        success: true,
        message: 'Payment captured successfully',
        data: {
          orderNumber: order.order_number,
          status: updatedOrder.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get PayPal client ID (public)
router.get('/client-id', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'paypal_client_id' } });
    const clientId = setting?.value || process.env.PAYPAL_CLIENT_ID || '';
    res.json({ success: true, clientId });
  } catch (error) {
    next(error);
  }
});

export default router;

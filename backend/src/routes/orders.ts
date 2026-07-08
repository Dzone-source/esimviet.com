import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../utils/prisma';
import { createError } from '../middleware/errorHandler';
import { createPayPalOrder } from '../services/paypal';

const router = Router();

// Create order (checkout intent)
router.post(
  '/',
  [
    body('customer_name').trim().notEmpty().withMessage('Name required'),
    body('customer_email').isEmail().withMessage('Valid email required'),
    body('plan_id').isInt({ min: 1 }).withMessage('Plan required'),
    body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be 1-10'),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const { customer_name, customer_email, plan_id, quantity } = req.body;

      const plan = await prisma.plan.findUnique({
        where: { id: parseInt(plan_id), is_active: true },
        include: { country: true },
      });

      if (!plan) throw createError('Plan not found or unavailable', 404);

      const total = parseFloat(plan.price.toString()) * parseInt(quantity);
      const orderNumber = `ESM-${uuidv4().substring(0, 8).toUpperCase()}`;

      const paypalOrderId = await createPayPalOrder(total, orderNumber);

      const order = await prisma.order.create({
        data: {
          order_number: orderNumber,
          customer_name,
          customer_email,
          paypal_order_id: paypalOrderId,
          status: 'Pending',
          total,
          order_items: {
            create: {
              plan_id: plan.id,
              qty: parseInt(quantity),
              price: plan.price,
            },
          },
        },
        include: {
          order_items: {
            include: { plan: { include: { country: true } } },
          },
        },
      });

      res.status(201).json({
        success: true,
        data: {
          orderId: order.id,
          orderNumber: order.order_number,
          paypalOrderId,
          total,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get order by order number (public - for order confirmation page)
router.get('/number/:orderNumber', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await prisma.order.findUnique({
      where: { order_number: req.params.orderNumber },
      include: {
        order_items: {
          include: {
            plan: {
              include: { country: true },
            },
          },
        },
      },
    });

    if (!order) throw createError('Order not found', 404);

    // Don't expose sensitive data publicly
    res.json({
      success: true,
      data: {
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        status: order.status,
        total: order.total,
        paid_at: order.paid_at,
        created_at: order.created_at,
        order_items: order.order_items.map((item) => ({
          plan: {
            title: item.plan.title,
            days: item.plan.days,
            data_amount: item.plan.data_amount,
            network: item.plan.network,
            country: item.plan.country,
          },
          qty: item.qty,
          price: item.price,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

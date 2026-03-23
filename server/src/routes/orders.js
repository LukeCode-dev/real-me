import { Router } from 'express';
import Order from '../models/Order.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Create order
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      userId: req.userId,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      status: 'confirmed',
      paymentStatus: 'paid',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// Get user's orders
router.get('/', authenticate, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Get order by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.userId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;

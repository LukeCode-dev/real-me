import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: config.jwtExpiry });

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: config.jwtExpiry });

    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

// Get profile
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate('avatar');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, shippingAddresses, preferences } = req.body;
    const update = {};
    if (name) update.name = name;
    if (shippingAddresses) update.shippingAddresses = shippingAddresses;
    if (preferences) update.preferences = preferences;

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;

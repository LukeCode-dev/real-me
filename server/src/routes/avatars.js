import { Router } from 'express';
import Avatar from '../models/Avatar.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Create avatar with photos
router.post('/', authenticate, upload.array('photos', 4), async (req, res, next) => {
  try {
    const { measurements, appearance } = req.body;
    const photos = req.files?.map((f) => `/uploads/${f.filename}`) || [];

    const parsedMeasurements = typeof measurements === 'string' ? JSON.parse(measurements) : measurements;
    const parsedAppearance = typeof appearance === 'string' ? JSON.parse(appearance) : appearance;

    const avatar = await Avatar.create({
      userId: req.userId,
      measurements: parsedMeasurements,
      appearance: parsedAppearance,
      photos,
      isComplete: true,
    });

    // Link avatar to user
    await User.findByIdAndUpdate(req.userId, { avatar: avatar._id });

    res.status(201).json(avatar);
  } catch (err) {
    next(err);
  }
});

// Get avatar
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const avatar = await Avatar.findById(req.params.id);
    if (!avatar) return res.status(404).json({ error: 'Avatar not found' });
    res.json(avatar);
  } catch (err) {
    next(err);
  }
});

// Update avatar
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const avatar = await Avatar.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!avatar) return res.status(404).json({ error: 'Avatar not found' });
    res.json(avatar);
  } catch (err) {
    next(err);
  }
});

// Get measurements
router.get('/:id/measurements', authenticate, async (req, res, next) => {
  try {
    const avatar = await Avatar.findById(req.params.id);
    if (!avatar) return res.status(404).json({ error: 'Avatar not found' });
    res.json(avatar.measurements);
  } catch (err) {
    next(err);
  }
});

// Get size recommendation for a product
router.get('/:avatarId/size-recommendation/:productId', authenticate, async (req, res, next) => {
  try {
    const avatar = await Avatar.findById(req.params.avatarId);
    if (!avatar) return res.status(404).json({ error: 'Avatar not found' });

    const recommendedSize = avatar.getRecommendedSize();

    res.json({
      avatarId: avatar._id,
      productId: req.params.productId,
      recommendedSize,
      fitConfidence: 0.92,
      measurements: avatar.measurements,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

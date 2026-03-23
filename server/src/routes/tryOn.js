import { Router } from 'express';
import Avatar from '../models/Avatar.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Simulate try-on (returns fit data for the avatar + product combination)
router.post('/simulate', authenticate, async (req, res, next) => {
  try {
    const { avatarId, productId, size, color } = req.body;

    let avatar;
    try {
      avatar = await Avatar.findById(avatarId);
    } catch {
      avatar = null;
    }

    // Mock fit analysis
    const fitAnalysis = {
      avatarId,
      productId,
      selectedSize: size,
      selectedColor: color,
      recommendedSize: avatar ? avatar.getRecommendedSize() : size,
      fitScore: 0.94,
      fitDetails: {
        chest: { fit: 'perfect', deviation: 0.5 },
        waist: { fit: 'perfect', deviation: 0.3 },
        hips: { fit: 'good', deviation: 1.2 },
        shoulders: { fit: 'perfect', deviation: 0.2 },
        length: { fit: 'ideal', deviation: 0.8 },
        sleeves: { fit: 'good', deviation: 1.0 },
      },
      overallFit: 'Great Fit',
      confidence: 0.92,
      notes: [
        'This size fits your body measurements well',
        'Slight room in the hip area for comfortable movement',
        'Sleeve length matches your arm measurements',
      ],
    };

    res.json(fitAnalysis);
  } catch (err) {
    next(err);
  }
});

export default router;

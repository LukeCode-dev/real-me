import { Router } from 'express';
import Store from '../models/Store.js';

const router = Router();

const SAMPLE_STORES = [
  { _id: 's1', name: 'AETHON', brand: 'AETHON', description: 'Futuristic tech-wear and performance fashion', theme: { primaryColor: '#ff6bcb', style: 'modern' }, categories: ['outerwear', 'tops'] },
  { _id: 's2', name: 'NOVA STYLE', brand: 'NOVA STYLE', description: 'Contemporary fashion with cutting-edge design', theme: { primaryColor: '#00d4ff', style: 'modern' }, categories: ['dresses', 'tops'] },
  { _id: 's3', name: 'CIPHER', brand: 'CIPHER', description: 'Street-luxury crossover for the urban explorer', theme: { primaryColor: '#b249f8', style: 'street' }, categories: ['bottoms', 'tops'] },
  { _id: 's4', name: 'OBSIDIAN', brand: 'OBSIDIAN', description: 'Dark luxury menswear and accessories', theme: { primaryColor: '#d4af37', style: 'luxury' }, categories: ['tops', 'accessories'] },
  { _id: 's5', name: 'PRISM', brand: 'PRISM', description: 'Bespoke tailoring meets modern precision', theme: { primaryColor: '#e0e0e0', style: 'luxury' }, categories: ['tops', 'bottoms'] },
  { _id: 's6', name: 'FLUX', brand: 'FLUX', description: 'Active lifestyle meets street culture', theme: { primaryColor: '#05ffa1', style: 'street' }, categories: ['tops', 'shoes'] },
  { _id: 's7', name: 'SOLE', brand: 'SOLE', description: 'Next-gen footwear engineered for perfect fit', theme: { primaryColor: '#00d4ff', style: 'modern' }, categories: ['shoes'] },
  { _id: 's8', name: 'RIOT', brand: 'RIOT', description: 'Bold streetwear with digital art influence', theme: { primaryColor: '#ff4444', style: 'street' }, categories: ['tops', 'outerwear'] },
  { _id: 's9', name: 'AURELIUS', brand: 'AURELIUS', description: 'Timeless luxury crafted from the finest materials', theme: { primaryColor: '#c9a96e', style: 'luxury' }, categories: ['outerwear'] },
  { _id: 's10', name: 'STRIDE', brand: 'STRIDE', description: 'Premium athletic footwear and accessories', theme: { primaryColor: '#b249f8', style: 'modern' }, categories: ['shoes'] },
  { _id: 's11', name: 'VORTEX', brand: 'VORTEX', description: 'Urban skatewear and casual essentials', theme: { primaryColor: '#ffaa00', style: 'street' }, categories: ['tops', 'bottoms', 'shoes'] },
];

router.get('/', async (req, res, next) => {
  try {
    let stores;
    try {
      stores = await Store.find({ isActive: true });
    } catch {
      stores = [];
    }
    res.json(stores.length > 0 ? stores : SAMPLE_STORES);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    let store;
    try {
      store = await Store.findById(req.params.id);
    } catch {
      store = null;
    }
    if (!store) {
      store = SAMPLE_STORES.find((s) => s._id === req.params.id);
    }
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json(store);
  } catch (err) {
    next(err);
  }
});

export default router;

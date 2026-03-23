import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// Sample data for when DB is empty
const SAMPLE_PRODUCTS = [
  {
    _id: '660a1b2c3d4e5f6a7b8c9d01',
    name: 'Neo Horizon Jacket', brand: 'AETHON', category: 'outerwear',
    price: 289, currency: 'USD', sizes: ['XS','S','M','L','XL','XXL'],
    colors: [{name:'Obsidian',hex:'#1a1a2e'},{name:'Midnight Blue',hex:'#1a2744'},{name:'Storm Gray',hex:'#4a4a5a'}],
    description: 'Premium tech-fabric jacket with adaptive thermal regulation.',
    rating: 4.8, reviews: 342, inStock: true,
  },
  {
    _id: '660a1b2c3d4e5f6a7b8c9d02',
    name: 'Flux Runner Tee', brand: 'FLUX', category: 'tops',
    price: 68, currency: 'USD', sizes: ['XS','S','M','L','XL'],
    colors: [{name:'White',hex:'#ffffff'},{name:'Black',hex:'#111111'},{name:'Neon Green',hex:'#05ffa1'}],
    description: 'Breathable performance tee with moisture-wicking fabric.',
    rating: 4.6, reviews: 891, inStock: true,
  },
  {
    _id: '660a1b2c3d4e5f6a7b8c9d03',
    name: 'Prism Tailored Suit', brand: 'PRISM', category: 'tops',
    price: 1250, currency: 'USD', sizes: ['44','46','48','50','52','54'],
    colors: [{name:'Charcoal',hex:'#2a2a2a'},{name:'Navy',hex:'#1a2744'},{name:'Burgundy',hex:'#5a1a2a'}],
    description: 'Bespoke-quality tailored suit crafted with Italian wool.',
    rating: 4.9, reviews: 156, inStock: true,
  },
  {
    _id: '660a1b2c3d4e5f6a7b8c9d04',
    name: 'Cipher Street Joggers', brand: 'CIPHER', category: 'bottoms',
    price: 95, currency: 'USD', sizes: ['XS','S','M','L','XL'],
    colors: [{name:'Black',hex:'#111111'},{name:'Dark Purple',hex:'#2a1a3e'},{name:'Olive',hex:'#3a4a2a'}],
    description: 'Technical joggers with 4-way stretch and hidden pockets.',
    rating: 4.7, reviews: 523, inStock: true,
  },
  {
    _id: '660a1b2c3d4e5f6a7b8c9d05',
    name: 'Aurora Flow Dress', brand: 'NOVA STYLE', category: 'dresses',
    price: 420, currency: 'USD', sizes: ['XS','S','M','L','XL'],
    colors: [{name:'Midnight',hex:'#0a0a2e'},{name:'Rose',hex:'#c4506e'},{name:'Ivory',hex:'#f5f0e8'}],
    description: 'Flowing silhouette dress with iridescent fabric.',
    rating: 4.9, reviews: 278, inStock: true,
  },
  {
    _id: '660a1b2c3d4e5f6a7b8c9d06',
    name: 'Sole Quantum Runner', brand: 'SOLE', category: 'shoes',
    price: 195, currency: 'USD', sizes: ['38','39','40','41','42','43','44','45'],
    colors: [{name:'Black/Cyan',hex:'#111111'},{name:'White/Purple',hex:'#f0f0f0'},{name:'All Black',hex:'#0a0a0a'}],
    description: 'Next-gen running shoes with responsive foam and carbon-fiber plate.',
    rating: 4.8, reviews: 1204, inStock: true,
  },
  {
    _id: '660a1b2c3d4e5f6a7b8c9d07',
    name: 'Aurelius Cashmere Coat', brand: 'AURELIUS', category: 'outerwear',
    price: 1800, currency: 'USD', sizes: ['S','M','L','XL'],
    colors: [{name:'Camel',hex:'#c4956a'},{name:'Black',hex:'#111111'},{name:'Charcoal',hex:'#3a3a3a'}],
    description: '100% Italian cashmere overcoat. Timeless luxury.',
    rating: 5.0, reviews: 89, inStock: true,
  },
  {
    _id: '660a1b2c3d4e5f6a7b8c9d08',
    name: 'Riot Graphic Hoodie', brand: 'RIOT', category: 'tops',
    price: 120, currency: 'USD', sizes: ['S','M','L','XL','XXL'],
    colors: [{name:'Black',hex:'#111111'},{name:'Red',hex:'#cc2222'},{name:'Washed Gray',hex:'#8a8a8a'}],
    description: 'Heavyweight oversized hoodie with exclusive digital art print.',
    rating: 4.5, reviews: 667, inStock: true,
  },
];

// Get all products
router.get('/', async (req, res, next) => {
  try {
    const { category, brand, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    let products;
    try {
      products = await Product.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
    } catch {
      products = [];
    }

    // Return sample data if DB is empty
    if (products.length === 0) {
      let samples = SAMPLE_PRODUCTS;
      if (category) samples = samples.filter((p) => p.category === category);
      if (brand) samples = samples.filter((p) => p.brand === brand);
      return res.json({ products: samples, total: samples.length, page: 1 });
    }

    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
});

// Get product by ID
router.get('/:id', async (req, res, next) => {
  try {
    let product;
    try {
      product = await Product.findById(req.params.id);
    } catch {
      product = null;
    }

    if (!product) {
      product = SAMPLE_PRODUCTS.find((p) => p._id === req.params.id);
    }

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Search products
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ products: [] });

    let products;
    try {
      products = await Product.find({ $text: { $search: q } });
    } catch {
      products = SAMPLE_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase())
      );
    }

    res.json({ products });
  } catch (err) {
    next(err);
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  res.json({
    categories: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'],
  });
});

export default router;

import { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../hooks/useStore';

// Sample product data
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Neo Horizon Jacket', brand: 'AETHON', category: 'outerwear',
    price: 289.00, currency: 'USD', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Obsidian', hex: '#1a1a2e' }, { name: 'Midnight Blue', hex: '#1a2744' }, { name: 'Storm Gray', hex: '#4a4a5a' }],
    images: [], model3dUrl: '', description: 'Premium tech-fabric jacket with adaptive thermal regulation. Sleek, futuristic design meets ultimate comfort.',
    rating: 4.8, reviews: 342, inStock: true, recommendedSize: 'M',
  },
  {
    id: '2', name: 'Flux Runner Tee', brand: 'FLUX', category: 'tops',
    price: 68.00, currency: 'USD', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'White', hex: '#ffffff' }, { name: 'Black', hex: '#111111' }, { name: 'Neon Green', hex: '#05ffa1' }],
    images: [], model3dUrl: '', description: 'Breathable performance tee with moisture-wicking fabric. Street style meets athletic function.',
    rating: 4.6, reviews: 891, inStock: true, recommendedSize: 'L',
  },
  {
    id: '3', name: 'Prism Tailored Suit', brand: 'PRISM', category: 'tops',
    price: 1250.00, currency: 'USD', sizes: ['44', '46', '48', '50', '52', '54'],
    colors: [{ name: 'Charcoal', hex: '#2a2a2a' }, { name: 'Navy', hex: '#1a2744' }, { name: 'Burgundy', hex: '#5a1a2a' }],
    images: [], model3dUrl: '', description: 'Bespoke-quality tailored suit crafted with Italian wool. Precision fit guaranteed by your digital twin.',
    rating: 4.9, reviews: 156, inStock: true, recommendedSize: '48',
  },
  {
    id: '4', name: 'Cipher Street Joggers', brand: 'CIPHER', category: 'bottoms',
    price: 95.00, currency: 'USD', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#111111' }, { name: 'Dark Purple', hex: '#2a1a3e' }, { name: 'Olive', hex: '#3a4a2a' }],
    images: [], model3dUrl: '', description: 'Technical joggers with 4-way stretch and hidden pockets. Urban mobility redefined.',
    rating: 4.7, reviews: 523, inStock: true, recommendedSize: 'M',
  },
  {
    id: '5', name: 'Aurora Flow Dress', brand: 'NOVA STYLE', category: 'dresses',
    price: 420.00, currency: 'USD', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Midnight', hex: '#0a0a2e' }, { name: 'Rose', hex: '#c4506e' }, { name: 'Ivory', hex: '#f5f0e8' }],
    images: [], model3dUrl: '', description: 'Flowing silhouette dress with iridescent fabric that shifts color in light. Perfect for any occasion.',
    rating: 4.9, reviews: 278, inStock: true, recommendedSize: 'S',
  },
  {
    id: '6', name: 'Sole Quantum Runner', brand: 'SOLE', category: 'shoes',
    price: 195.00, currency: 'USD', sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Black/Cyan', hex: '#111111' }, { name: 'White/Purple', hex: '#f0f0f0' }, { name: 'All Black', hex: '#0a0a0a' }],
    images: [], model3dUrl: '', description: 'Next-gen running shoes with responsive foam and carbon-fiber plate. Precision-fit to your exact foot measurements.',
    rating: 4.8, reviews: 1204, inStock: true, recommendedSize: '42',
  },
  {
    id: '7', name: 'Aurelius Cashmere Coat', brand: 'AURELIUS', category: 'outerwear',
    price: 1800.00, currency: 'USD', sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Camel', hex: '#c4956a' }, { name: 'Black', hex: '#111111' }, { name: 'Charcoal', hex: '#3a3a3a' }],
    images: [], model3dUrl: '', description: '100% Italian cashmere overcoat. Timeless luxury tailored to your exact body shape.',
    rating: 5.0, reviews: 89, inStock: true, recommendedSize: 'M',
  },
  {
    id: '8', name: 'Riot Graphic Hoodie', brand: 'RIOT', category: 'tops',
    price: 120.00, currency: 'USD', sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Black', hex: '#111111' }, { name: 'Red', hex: '#cc2222' }, { name: 'Washed Gray', hex: '#8a8a8a' }],
    images: [], model3dUrl: '', description: 'Heavyweight oversized hoodie with exclusive digital art print. Statement streetwear.',
    rating: 4.5, reviews: 667, inStock: true, recommendedSize: 'L',
  },
];

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filtered = SAMPLE_PRODUCTS.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory.toLowerCase()
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-dark-600 text-dark-200 hover:bg-dark-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-dark-600 border border-dark-400 rounded-xl px-4 py-2 text-sm text-white focus:border-neon-blue focus:outline-none"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-20">
          <p className="text-dark-300 text-lg">No products found in this category</p>
        </div>
      )}
    </div>
  );
}

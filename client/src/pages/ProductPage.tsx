import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TryOnView from '../components/shop/TryOnView';
import { useCartStore, Product } from '../hooks/useStore';

// This would come from API in production
const MOCK_PRODUCT: Product = {
  id: '1', name: 'Neo Horizon Jacket', brand: 'AETHON', category: 'outerwear',
  price: 289.00, currency: 'USD', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: [
    { name: 'Obsidian', hex: '#1a1a2e' },
    { name: 'Midnight Blue', hex: '#1a2744' },
    { name: 'Storm Gray', hex: '#4a4a5a' },
  ],
  images: [], model3dUrl: '',
  description: 'Premium tech-fabric jacket with adaptive thermal regulation and water-resistant coating. The Neo Horizon features a sleek, futuristic design with hidden smart-pockets, magnetic closures, and reflective detailing. Built for the modern urbanite who demands both style and function.',
  rating: 4.8, reviews: 342, inStock: true, recommendedSize: 'M',
};

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState(MOCK_PRODUCT.recommendedSize || '');
  const [selectedColor, setSelectedColor] = useState(MOCK_PRODUCT.colors[0]?.name || '');
  const [showTryOn, setShowTryOn] = useState(true);

  const product = MOCK_PRODUCT; // Would fetch by productId

  const handleAddToCart = () => {
    addItem({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-dark-300 hover:text-white text-sm mb-6 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Try-On View / Images */}
        <div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowTryOn(true)}
              className={`px-4 py-2 rounded-lg text-sm ${showTryOn ? 'bg-primary-600 text-white' : 'bg-dark-600 text-dark-200'}`}
            >
              Virtual Try-On
            </button>
            <button
              onClick={() => setShowTryOn(false)}
              className={`px-4 py-2 rounded-lg text-sm ${!showTryOn ? 'bg-primary-600 text-white' : 'bg-dark-600 text-dark-200'}`}
            >
              Product Photos
            </button>
          </div>

          {showTryOn ? (
            <TryOnView product={product} />
          ) : (
            <div className="aspect-[3/4] rounded-2xl bg-dark-700 flex items-center justify-center">
              <p className="text-dark-400">Product photos</p>
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="space-y-6">
          <div>
            <p className="text-primary-400 font-semibold uppercase tracking-wider text-sm">{product.brand}</p>
            <h1 className="text-3xl font-display font-bold mt-1">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-dark-500'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-dark-200 text-sm ml-1">{product.rating} ({product.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

          <p className="text-dark-200 leading-relaxed">{product.description}</p>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold">Size</label>
              {product.recommendedSize && (
                <span className="text-xs text-neon-green bg-neon-green/10 px-2 py-1 rounded-lg">
                  Recommended: {product.recommendedSize}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-12 rounded-xl text-sm font-semibold transition-all ${
                    selectedSize === size
                      ? size === product.recommendedSize
                        ? 'bg-neon-green/20 text-neon-green border-2 border-neon-green'
                        : 'bg-primary-600 text-white border-2 border-primary-600'
                      : 'bg-dark-600 text-dark-200 border-2 border-transparent hover:border-dark-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Color: <span className="text-dark-200 font-normal">{selectedColor}</span>
            </label>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-12 h-12 rounded-xl transition-all ${
                    selectedColor === color.name
                      ? 'ring-2 ring-neon-blue ring-offset-2 ring-offset-dark-700 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 text-center text-lg py-4"
            >
              Add to Cart
            </button>
            <button className="btn-secondary px-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Product details */}
          <div className="card bg-dark-700/30 space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm">30-day hassle-free returns</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-neon-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm">Digital twin verified fit guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

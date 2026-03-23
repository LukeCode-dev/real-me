import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, useCartStore } from '../../hooks/useStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      product,
      size: product.recommendedSize || product.sizes[0],
      color: product.colors[0]?.name || 'Default',
      quantity: 1,
    });
  };

  return (
    <div
      className="card cursor-pointer group"
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product image */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-dark-700 mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Placeholder for 3D product view */}
          <div className="w-full h-full bg-gradient-to-b from-dark-600 to-dark-800 flex items-center justify-center">
            <svg className="w-20 h-20 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.recommendedSize && (
            <span className="bg-neon-green/20 text-neon-green text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
              Recommended: {product.recommendedSize}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Try-On button overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="btn-primary text-sm">
            Try On Your Avatar
          </button>
        </div>

        {/* Quick add */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center
            hover:bg-primary-600 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Product info */}
      <div>
        <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <h3 className="font-display font-semibold text-white group-hover:text-neon-blue transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold">
            {product.currency === 'USD' ? '$' : product.currency}{product.price.toFixed(2)}
          </p>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-dark-200">{product.rating}</span>
          </div>
        </div>

        {/* Available colors */}
        <div className="flex gap-1 mt-3">
          {product.colors.slice(0, 5).map((color) => (
            <div
              key={color.hex}
              className="w-4 h-4 rounded-full border border-dark-400"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 5 && (
            <span className="text-xs text-dark-300 ml-1">+{product.colors.length - 5}</span>
          )}
        </div>
      </div>
    </div>
  );
}

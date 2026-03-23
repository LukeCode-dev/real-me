import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../hooks/useStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-dark-300 mb-6">Items you try on and love will appear here</p>
        <button onClick={() => navigate('/store/all')} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">
        Shopping <span className="gradient-text">Cart</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.size}-${item.color}`} className="card flex gap-4">
              {/* Product thumbnail */}
              <div className="w-24 h-32 rounded-xl bg-dark-700 flex-shrink-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-primary-400 font-semibold uppercase">{item.product.brand}</p>
                    <h3 className="font-display font-semibold">{item.product.name}</h3>
                    <div className="flex gap-3 mt-1 text-sm text-dark-300">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                    </div>
                    {item.size === item.product.recommendedSize && (
                      <span className="inline-block mt-1 text-xs text-neon-green bg-neon-green/10 px-2 py-0.5 rounded">
                        Perfect fit for your body
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center hover:bg-dark-500"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center hover:bg-dark-500"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="card h-fit sticky top-20">
          <h3 className="font-display text-xl font-semibold mb-6">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-300">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Shipping</span>
              <span className={shipping === 0 ? 'text-neon-green' : ''}>
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-300">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/5 pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button className="btn-primary w-full text-center mt-6 py-4">
            Proceed to Checkout
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/store/all')}
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              Continue Shopping
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-dark-300">
              <svg className="w-4 h-4 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              All items verified for your body measurements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

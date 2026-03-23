import { useWorldStore, useCartStore } from '../../hooks/useStore';
import { useNavigate } from 'react-router-dom';

export default function WorldHUD() {
  const { currentLocation, connectedUsers } = useWorldStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <div className="glass rounded-xl px-4 py-2 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-sm text-dark-100">
              <span className="text-neon-green font-semibold">{connectedUsers || 42}</span> online
            </span>
          </div>
        </div>

        <div className="glass rounded-xl px-5 py-2">
          <p className="text-sm text-dark-200">
            Location: <span className="text-neon-blue font-semibold capitalize">{currentLocation}</span>
          </p>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => navigate('/cart')}
            className="glass glass-hover rounded-xl px-4 py-2 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="bg-neon-pink text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
            )}
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="glass glass-hover rounded-xl px-4 py-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom minimap / navigation */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <div className="glass rounded-2xl p-4 w-52">
          <p className="text-xs text-dark-200 mb-3 font-semibold uppercase tracking-wider">Quick Travel</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Plaza', icon: '⬡', color: 'text-neon-blue' },
              { name: 'Fashion', icon: '✦', color: 'text-neon-pink' },
              { name: 'Luxury', icon: '◆', color: 'text-yellow-400' },
              { name: 'Street', icon: '▲', color: 'text-neon-green' },
            ].map(({ name, icon, color }) => (
              <button
                key={name}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700/50 hover:bg-dark-600 transition-colors text-left"
              >
                <span className={`${color} text-lg`}>{icon}</span>
                <span className="text-xs text-dark-100">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4">
        <div className="glass rounded-xl px-4 py-2 text-xs text-dark-300">
          Scroll to zoom · Drag to look · Click store to enter
        </div>
      </div>
    </div>
  );
}

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../../hooks/useStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { path: '/world', label: 'Virtual World' },
    { path: '/create-avatar', label: 'My Avatar' },
    { path: '/store/all', label: 'Shop' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">RM</span>
            </div>
            <span className="font-display font-bold text-xl">
              <span className="gradient-text">Real Me</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-dark-200 hover:text-white hover:bg-dark-600/50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl hover:bg-dark-600/50 transition-colors"
            >
              <svg className="w-6 h-6 text-dark-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-pink text-white text-xs flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-neon-purple flex items-center justify-center text-white font-semibold text-sm"
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Link>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary text-sm py-2">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

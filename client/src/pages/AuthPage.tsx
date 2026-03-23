import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../hooks/useStore';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock auth — in production this calls the real API
    setTimeout(() => {
      login(
        { id: '1', email, name: name || email.split('@')[0] },
        'mock-jwt-token-' + Date.now()
      );
      setLoading(false);
      navigate('/create-avatar');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 world-grid opacity-30" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">RM</span>
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Join Real Me'}
          </h1>
          <p className="text-dark-300">
            {isLogin ? 'Sign in to access your digital twin' : 'Create your account and build your avatar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-dark-200 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-dark-700 border border-dark-400 rounded-xl px-4 py-3 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue/30 placeholder-dark-400"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-dark-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-dark-700 border border-dark-400 rounded-xl px-4 py-3 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue/30 placeholder-dark-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-dark-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-dark-700 border border-dark-400 rounded-xl px-4 py-3 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue/30 placeholder-dark-400"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center py-3 disabled:opacity-50"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-dark-300">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-400 hover:text-primary-300 font-semibold"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}

import { useAuthStore, useAvatarStore } from '../hooks/useStore';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { avatar, measurements } = useAvatarStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">
        My <span className="gradient-text">Profile</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account info */}
        <div className="card">
          <h3 className="font-display font-semibold text-lg mb-4">Account</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-neon-purple flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.name || 'User'}</p>
              <p className="text-dark-300 text-sm">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-dark-700/50 hover:bg-dark-600 transition-colors text-sm">
              Edit Profile
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-dark-700/50 hover:bg-dark-600 transition-colors text-sm">
              Shipping Addresses
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-dark-700/50 hover:bg-dark-600 transition-colors text-sm">
              Payment Methods
            </button>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="w-full text-left px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors text-sm text-red-400"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Avatar info */}
        <div className="card">
          <h3 className="font-display font-semibold text-lg mb-4">My Digital Twin</h3>
          <div className="space-y-3 text-sm">
            {measurements.height ? (
              <>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-dark-300">Height</span>
                  <span>{measurements.height} cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-dark-300">Weight</span>
                  <span>{measurements.weight || '—'} kg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-dark-300">Chest</span>
                  <span>{measurements.chest || '—'} cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-dark-300">Waist</span>
                  <span>{measurements.waist || '—'} cm</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-dark-300">Hips</span>
                  <span>{measurements.hips || '—'} cm</span>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-dark-400 mb-4">No avatar created yet</p>
                <button
                  onClick={() => navigate('/create-avatar')}
                  className="btn-primary text-sm"
                >
                  Create Avatar
                </button>
              </div>
            )}
          </div>
          {measurements.height && (
            <button
              onClick={() => navigate('/create-avatar')}
              className="btn-secondary w-full text-center mt-4 text-sm"
            >
              Edit Avatar
            </button>
          )}
        </div>

        {/* Order history */}
        <div className="card md:col-span-2">
          <h3 className="font-display font-semibold text-lg mb-4">Order History</h3>
          <div className="text-center py-8">
            <p className="text-dark-400 mb-2">No orders yet</p>
            <p className="text-dark-500 text-sm">Items you purchase will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

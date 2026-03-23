import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AvatarCreator = lazy(() => import('./pages/AvatarCreator'));
const VirtualWorld = lazy(() => import('./pages/VirtualWorld'));
const StorePage = lazy(() => import('./pages/StorePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<Layout />}>
          <Route path="/create-avatar" element={<AvatarCreator />} />
          <Route path="/world" element={<VirtualWorld />} />
          <Route path="/store/:storeId" element={<StorePage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

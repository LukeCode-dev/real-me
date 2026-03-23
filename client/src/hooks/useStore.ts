import { create } from 'zustand';

// ─── Avatar Types ────────────────────────────────
export interface BodyMeasurements {
  height: number;        // cm
  weight: number;        // kg
  chest: number;         // cm
  waist: number;         // cm
  hips: number;          // cm
  shoulders: number;     // cm
  inseam: number;        // cm
  armLength: number;     // cm
  neckCircumference: number;
  shoeSize: number;
}

export interface AvatarData {
  id: string;
  userId: string;
  measurements: BodyMeasurements;
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  faceShape: string;
  bodyType: string;
  photos: string[];
  model3dUrl?: string;
  createdAt: string;
}

// ─── Product Types ───────────────────────────────
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';
  price: number;
  currency: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  model3dUrl: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  recommendedSize?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

// ─── Store Types ─────────────────────────────────
export interface VirtualStore {
  id: string;
  name: string;
  brand: string;
  description: string;
  logo: string;
  position: [number, number, number];
  theme: string;
  products: Product[];
}

// ─── User Types ──────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: AvatarData;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// ─── Auth Store ──────────────────────────────────
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('rm_token'),
  isAuthenticated: !!localStorage.getItem('rm_token'),
  login: (user, token) => {
    localStorage.setItem('rm_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('rm_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));

// ─── Avatar Store ────────────────────────────────
interface AvatarState {
  avatar: AvatarData | null;
  scanStep: number;
  isScanning: boolean;
  measurements: Partial<BodyMeasurements>;
  setAvatar: (avatar: AvatarData) => void;
  setScanStep: (step: number) => void;
  setIsScanning: (scanning: boolean) => void;
  updateMeasurements: (m: Partial<BodyMeasurements>) => void;
  resetScan: () => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  avatar: null,
  scanStep: 0,
  isScanning: false,
  measurements: {},
  setAvatar: (avatar) => set({ avatar }),
  setScanStep: (step) => set({ scanStep: step }),
  setIsScanning: (scanning) => set({ isScanning: scanning }),
  updateMeasurements: (m) =>
    set((state) => ({
      measurements: { ...state.measurements, ...m },
    })),
  resetScan: () =>
    set({ scanStep: 0, isScanning: false, measurements: {} }),
}));

// ─── Cart Store ──────────────────────────────────
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.product.id === item.product.id && i.size === item.size && i.color === item.color
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === item.product.id && i.size === item.size && i.color === item.color
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      ),
    })),
  clearCart: () => set({ items: [] }),
  total: () =>
    get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
}));

// ─── World Store ─────────────────────────────────
interface WorldState {
  currentLocation: string;
  playerPosition: [number, number, number];
  isLoading: boolean;
  connectedUsers: number;
  setLocation: (location: string) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setIsLoading: (loading: boolean) => void;
  setConnectedUsers: (count: number) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  currentLocation: 'plaza',
  playerPosition: [0, 0, 0],
  isLoading: true,
  connectedUsers: 0,
  setLocation: (location) => set({ currentLocation: location }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setConnectedUsers: (count) => set({ connectedUsers: count }),
}));

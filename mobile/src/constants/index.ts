/**
 * Real Me Scanner - App Constants
 */

export { default as theme } from './theme';
export {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  glassMorphism,
} from './theme';
export type { Theme } from './theme';

// ─── Scan Steps ──────────────────────────────────────────────────────────────

export const SCAN_STEPS = ['front', 'right', 'back', 'left', 'face'] as const;
export type ScanStep = (typeof SCAN_STEPS)[number];

export const SCAN_INSTRUCTIONS: Record<ScanStep, { title: string; description: string; tip: string }> = {
  front: {
    title: 'Front View',
    description: 'Stand facing the camera with arms slightly away from your body.',
    tip: 'Keep your posture natural and relaxed. Wear fitted clothing for best results.',
  },
  right: {
    title: 'Right Side',
    description: 'Turn 90 degrees to show your right side profile.',
    tip: 'Keep your arms relaxed at your sides. Stand straight but comfortable.',
  },
  back: {
    title: 'Back View',
    description: 'Turn to face away from the camera completely.',
    tip: 'Maintain the same posture as the front view. Keep feet shoulder-width apart.',
  },
  left: {
    title: 'Left Side',
    description: 'Turn to show your left side profile.',
    tip: 'Almost done! Same natural posture as the right side.',
  },
  face: {
    title: 'Face Scan',
    description: 'Look directly at the camera for facial feature mapping.',
    tip: 'Remove glasses if possible. Keep a neutral expression with good lighting on your face.',
  },
};

// ─── Body Measurements ───────────────────────────────────────────────────────

export const BODY_MEASUREMENTS = [
  { key: 'height', label: 'Height', unit: 'cm', min: 120, max: 230, icon: 'ruler' },
  { key: 'weight', label: 'Weight', unit: 'kg', min: 30, max: 200, icon: 'scale' },
  { key: 'chest', label: 'Chest', unit: 'cm', min: 60, max: 150, icon: 'chest' },
  { key: 'waist', label: 'Waist', unit: 'cm', min: 50, max: 140, icon: 'waist' },
  { key: 'hips', label: 'Hips', unit: 'cm', min: 60, max: 150, icon: 'hips' },
  { key: 'shoulders', label: 'Shoulders', unit: 'cm', min: 30, max: 70, icon: 'shoulders' },
  { key: 'inseam', label: 'Inseam', unit: 'cm', min: 50, max: 110, icon: 'inseam' },
  { key: 'armLength', label: 'Arm Length', unit: 'cm', min: 40, max: 90, icon: 'arm' },
  { key: 'neckCircumference', label: 'Neck', unit: 'cm', min: 25, max: 55, icon: 'neck' },
  { key: 'shoeSize', label: 'Shoe Size', unit: 'EU', min: 34, max: 50, icon: 'shoe' },
] as const;

export type MeasurementKey = (typeof BODY_MEASUREMENTS)[number]['key'];

// ─── API Endpoints ───────────────────────────────────────────────────────────

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://api.realme-scanner.com';

export const API_ENDPOINTS = {
  base: API_BASE,

  // Auth
  auth: {
    register: `${API_BASE}/api/auth/register`,
    login: `${API_BASE}/api/auth/login`,
    profile: `${API_BASE}/api/auth/profile`,
    forgotPassword: `${API_BASE}/api/auth/forgot-password`,
    resetPassword: `${API_BASE}/api/auth/reset-password`,
  },

  // Avatar
  avatars: {
    create: `${API_BASE}/api/avatars`,
    get: (id: string) => `${API_BASE}/api/avatars/${id}`,
    update: (id: string) => `${API_BASE}/api/avatars/${id}`,
    measurements: (id: string) => `${API_BASE}/api/avatars/${id}/measurements`,
    sizeRecommendation: (avatarId: string, productId: string) =>
      `${API_BASE}/api/avatars/${avatarId}/size-recommendation/${productId}`,
  },

  // Scan
  scan: {
    upload: `${API_BASE}/api/scan/upload`,
    process: `${API_BASE}/api/scan/process`,
    status: (scanId: string) => `${API_BASE}/api/scan/status/${scanId}`,
    results: (scanId: string) => `${API_BASE}/api/scan/results/${scanId}`,
  },

  // Products
  products: {
    list: `${API_BASE}/api/products`,
    get: (id: string) => `${API_BASE}/api/products/${id}`,
    search: `${API_BASE}/api/products/search`,
    categories: `${API_BASE}/api/products/categories`,
  },

  // Try-on
  tryOn: {
    simulate: `${API_BASE}/api/try-on/simulate`,
  },

  // Orders
  orders: {
    create: `${API_BASE}/api/orders`,
    list: `${API_BASE}/api/orders`,
    get: (id: string) => `${API_BASE}/api/orders/${id}`,
  },
} as const;

// ─── Storage Keys ────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'real_me_auth_token',
  REFRESH_TOKEN: 'real_me_refresh_token',
  USER_DATA: 'real_me_user_data',
  AVATAR_DATA: 'real_me_avatar_data',
  SCAN_PROGRESS: 'real_me_scan_progress',
  SCAN_PHOTOS: 'real_me_scan_photos',
  MEASUREMENTS: 'real_me_measurements',
  ONBOARDING_COMPLETE: 'real_me_onboarding_done',
  THEME_PREFERENCE: 'real_me_theme_pref',
  NOTIFICATIONS_ENABLED: 'real_me_notifications',
  LAST_SYNC: 'real_me_last_sync',
} as const;

// ─── App Config ──────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  name: 'Real Me Scanner',
  version: '1.0.0',
  maxScanPhotos: 5,
  maxPhotoSizeMB: 10,
  scanTimeoutMs: 30000,
  supportedImageFormats: ['image/jpeg', 'image/png', 'image/webp'],
  cameraResolution: { width: 1920, height: 1080 },
} as const;

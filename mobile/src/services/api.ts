/**
 * Real Me Scanner - API Client
 * Axios-based HTTP client with JWT auth, interceptors, and typed endpoints.
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import * as SecureStore from 'expo-secure-store';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  shippingAddresses?: ShippingAddress[];
  preferences?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  shippingAddresses?: Partial<ShippingAddress>[];
  preferences?: Record<string, unknown>;
}

export interface ScanUploadResponse {
  scanId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  message: string;
}

export interface ScanStatus {
  scanId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  estimatedTimeRemaining?: number;
}

export interface ScanResults {
  scanId: string;
  measurements: MeasurementsResponse;
  meshUrl?: string;
  thumbnailUrl?: string;
  confidence: number;
  completedAt: string;
}

export interface MeasurementsResponse {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  shoulders: number;
  inseam: number;
  armLength: number;
  neckCircumference: number;
  shoeSize: number;
}

export interface AvatarData {
  id: string;
  userId: string;
  measurements: MeasurementsResponse;
  appearance: AvatarAppearance;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AvatarAppearance {
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  bodyType: string;
}

export interface AvatarCreateRequest {
  measurements: Partial<MeasurementsResponse>;
  appearance: Partial<AvatarAppearance>;
}

export interface AvatarUpdateRequest {
  measurements?: Partial<MeasurementsResponse>;
  appearance?: Partial<AvatarAppearance>;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api';
const TOKEN_KEY = 'real_me_auth_token';
const IS_DEV = __DEV__;

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach JWT
// ---------------------------------------------------------------------------

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // SecureStore may throw on web — silently ignore
    }

    if (IS_DEV) {
      console.log(
        `[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
        config.params ?? '',
      );
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Response interceptor — logging + 401 handling
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (IS_DEV) {
      console.log(
        `[API] ${response.status} ${response.config.url}`,
        typeof response.data === 'object'
          ? `(${JSON.stringify(response.data).length} bytes)`
          : '',
      );
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    if (IS_DEV) {
      console.error(
        `[API] Error ${error.response?.status ?? 'NETWORK'} ${error.config?.url}`,
        error.response?.data?.message ?? error.message,
      );
    }

    if (error.response?.status === 401) {
      // Clear stored credentials
      try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } catch {
        // ignore
      }
      // The auth store listener should pick this up and redirect to login.
      // We still reject so callers can handle it if needed.
    }

    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await apiClient.get<User>('/auth/profile');
    return res.data;
  },

  updateProfile: async (data: ProfileUpdateRequest): Promise<User> => {
    const res = await apiClient.put<User>('/auth/profile', data);
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Scan API
// ---------------------------------------------------------------------------

export const scanAPI = {
  uploadBodyScan: async (photos: FormData): Promise<ScanUploadResponse> => {
    const res = await apiClient.post<ScanUploadResponse>(
      '/avatars/scan/body',
      photos,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60_000,
      },
    );
    return res.data;
  },

  uploadFaceScan: async (photos: FormData): Promise<ScanUploadResponse> => {
    const res = await apiClient.post<ScanUploadResponse>(
      '/avatars/scan/face',
      photos,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60_000,
      },
    );
    return res.data;
  },

  getScanStatus: async (scanId: string): Promise<ScanStatus> => {
    const res = await apiClient.get<ScanStatus>(`/avatars/scan/${scanId}/status`);
    return res.data;
  },

  getScanResults: async (scanId: string): Promise<ScanResults> => {
    const res = await apiClient.get<ScanResults>(`/avatars/scan/${scanId}/results`);
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Avatar API
// ---------------------------------------------------------------------------

export const avatarAPI = {
  create: async (data: AvatarCreateRequest): Promise<AvatarData> => {
    const res = await apiClient.post<AvatarData>('/avatars', data);
    return res.data;
  },

  get: async (): Promise<AvatarData> => {
    const res = await apiClient.get<AvatarData>('/avatars/me');
    return res.data;
  },

  update: async (data: AvatarUpdateRequest): Promise<AvatarData> => {
    const res = await apiClient.put<AvatarData>('/avatars/me', data);
    return res.data;
  },

  getMeasurements: async (): Promise<MeasurementsResponse> => {
    const res = await apiClient.get<MeasurementsResponse>(
      '/avatars/me/measurements',
    );
    return res.data;
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Store a JWT token in secure storage. */
export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/** Remove the JWT token from secure storage. */
export async function clearAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/** Read the current JWT token (or null). */
export async function getAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export default apiClient;

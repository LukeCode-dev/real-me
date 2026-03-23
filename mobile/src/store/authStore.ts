/**
 * Real Me Scanner - Auth Store (Zustand)
 * Manages authentication state, JWT persistence via expo-secure-store,
 * and user profile data.
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import {
  authAPI,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  type User,
  type ProfileUpdateRequest,
} from '../services/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /** Attempt login with email + password. */
  login: (email: string, password: string) => Promise<void>;

  /** Register a new account. */
  register: (name: string, email: string, password: string) => Promise<void>;

  /** Clear credentials and redirect state. */
  logout: () => Promise<void>;

  /** Read token from SecureStore on app start; fetch profile if present. */
  loadToken: () => Promise<void>;

  /** Update the current user's profile. */
  updateProfile: (data: ProfileUpdateRequest) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  // -----------------------------------------------------------------------
  // login
  // -----------------------------------------------------------------------
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authAPI.login({ email, password });
      await setAuthToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // -----------------------------------------------------------------------
  // register
  // -----------------------------------------------------------------------
  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authAPI.register({ name, email, password });
      await setAuthToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // -----------------------------------------------------------------------
  // logout
  // -----------------------------------------------------------------------
  logout: async () => {
    await clearAuthToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  // -----------------------------------------------------------------------
  // loadToken
  // -----------------------------------------------------------------------
  loadToken: async () => {
    set({ isLoading: true });
    try {
      const token = await getAuthToken();
      if (!token) {
        set({ isLoading: false });
        return;
      }

      // Token exists — attempt to fetch the profile
      set({ token });
      const user = await authAPI.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      // Token may be expired / invalid — clear it
      await clearAuthToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  // -----------------------------------------------------------------------
  // updateProfile
  // -----------------------------------------------------------------------
  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const updatedUser = await authAPI.updateProfile(data);
      set({ user: updatedUser, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

export default useAuthStore;

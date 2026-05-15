import { isAxiosError } from 'axios';
import { create } from 'zustand';
import { createSellerAccount, getSellerProfile, loginSeller as loginSellerAPI, updateSellerProfile } from '../services/api';
import { getStorageItem, removeStorageItems, setStorageItem } from '../utils/storage';

// Constants for storage keys (alphanumeric, dots, dashes, underscores only)
const TOKEN_KEY = 'paytrume.auth_token';
const USER_KEY = 'paytrume.auth_user';
const PROFILE_KEY = 'paytrume.auth_profile';

interface SellerSignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile: string;
}

interface SellerLoginData {
  email: string;
  password: string;
  trusted?: boolean;
}

export interface SellerProfile {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  account_number: string | null;
  account_name: string | null;
  isAdmin: boolean;
  verifyAccount: boolean;
  my_products: any[];
  my_tx: any[];
  limit_to_payout: boolean;
  notifications: any[];
  details: any[];
  fingerprints: any[];
  address: {
    city: string;
    state: string;
    country: string;
    streetAddress: string;
    postalCode: string;
  };
  avatar: string | null;
  __v: number;
  [key: string]: any; // Allow additional properties
  createdAt: string;
  updatedAt: string;
}

export interface NetworkError {
  type: 'network';
  message: string;
}

export interface ServerError {
  type: 'server';
  message: string;
  status?: number;
}

export type SignupError = NetworkError | ServerError | null;

interface AuthState {
  user: string | null;
  token: string | null;
  profile: SellerProfile | null;
  loading: boolean;
  error: SignupError;
  isHydrated: boolean;
  setUser: (user: string | null) => void;
  signupSeller: (data: SellerSignupData) => Promise<void>;
  loginSeller: (data: SellerLoginData) => Promise<void>;
  fetchSellerProfile: () => Promise<void>;
  updateProfile: (updateData: { first_name?: string; last_name?: string; mobile?: string; account_number?: string; account_name?: string; avatar?: string; address?: any }) => Promise<void>;
  clearError: () => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  profile: null,
  loading: false,
  error: null,
  isHydrated: false,

  setUser: (user) => set({ user }),

  // Load token, user, and profile from storage
  hydrate: async () => {
    try {
      const [token, user, profileJson] = await Promise.all([getStorageItem(TOKEN_KEY), getStorageItem(USER_KEY), getStorageItem(PROFILE_KEY)]);

      const profile = profileJson ? JSON.parse(profileJson) : null;

      if (token) {
        set({ token, user, profile, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch (error) {
      console.error('Failed to hydrate auth store:', error);
      set({ isHydrated: true });
    }
  },

  signupSeller: async (data: SellerSignupData) => {
    set({ loading: true, error: null });
    try {
      const response = await createSellerAccount(data);

      if (response.success) {
        const token = response.data;
        const user = `${data.first_name} ${data.last_name}`;

        // Save to storage
        await Promise.all([setStorageItem(TOKEN_KEY, token), setStorageItem(USER_KEY, user)]);

        set({
          token,
          user,
          loading: false,
        });
      } else {
        set({
          error: {
            type: 'server',
            message: response.message || 'Signup failed',
            status: response.status,
          },
          loading: false,
        });
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      console.log('Signup error:', error);

      // Check if it's a network error (no response from server)
      const isNetworkError = isAxiosError(error) && !error.response;

      if (isNetworkError) {
        // Network error - connection issues, timeout, etc.
        const errorMessage =
          error.code === 'ECONNABORTED'
            ? 'Request timeout. Please check your connection and try again.'
            : error.message === 'Network Error'
              ? 'Unable to connect to the server. Please check your internet connection.'
              : error.message || 'Network connection error';

        set({
          error: {
            type: 'network',
            message: errorMessage,
          },
          loading: false,
        });
        throw error;
      } else {
        // Server error or other error
        const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during signup';
        const status = error?.response?.status;

        set({
          error: {
            type: 'server',
            message: errorMessage,
            status,
          },
          loading: false,
        });
        throw error;
      }
    }
  },

  // Login seller function
  loginSeller: async (data: SellerLoginData) => {
    set({ loading: true, error: null });
    try {
      const response = await loginSellerAPI(data);

      if (response.success) {
        const token = response.data;

        // Save to storage
        await setStorageItem(TOKEN_KEY, token);

        set({
          token,
          loading: false,
        });

        // Fetch profile after successful login
        const state = useAuthStore.getState();
        await state.fetchSellerProfile();
      } else {
        set({
          error: {
            type: 'server',
            message: response.message || 'Login failed',
            status: response.status,
          },
          loading: false,
        });
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.log('Login error:', error);

      const isNetworkError = isAxiosError(error) && !error.response;

      if (isNetworkError) {
        const errorMessage =
          error.code === 'ECONNABORTED'
            ? 'Request timeout. Please check your connection and try again.'
            : error.message === 'Network Error'
              ? 'Unable to connect to the server. Please check your internet connection.'
              : error.message || 'Network connection error';

        set({
          error: {
            type: 'network',
            message: errorMessage,
          },
          loading: false,
        });
        throw error;
      } else {
        const errorMessage = error?.response?.data?.message || error.message || 'An error occurred during login';
        const status = error?.response?.status;

        set({
          error: {
            type: 'server',
            message: errorMessage,
            status,
          },
          loading: false,
        });
        throw error;
      }
    }
  },

  // Fetch seller profile function
  fetchSellerProfile: async () => {
    try {
      const response = await getSellerProfile();

      if (response.success && response.data) {
        const profile = response.data;
        const user = `${profile.first_name} ${profile.last_name}`;

        // Save profile to storage
        await Promise.all([setStorageItem(USER_KEY, user), setStorageItem(PROFILE_KEY, JSON.stringify(profile))]);

        set({
          profile,
          user,
        });
      } else {
        console.error('Failed to fetch profile:', response.message);
      }
    } catch (error) {
      console.error('Error fetching seller profile:', error);
    }
  },

  // Update seller profile function
  updateProfile: async (updateData) => {
    try {
      const response = await updateSellerProfile(updateData);

      if (response.success && response.data) {
        const profile = response.data;
        const user = `${profile.first_name} ${profile.last_name}`;

        // Save updated profile to storage
        await Promise.all([setStorageItem(USER_KEY, user), setStorageItem(PROFILE_KEY, JSON.stringify(profile))]);

        set({
          profile,
          user,
        });
      } else {
        console.error('Failed to update profile:', response.message);
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating seller profile:', error);
      throw error;
    }
  },

  // Clear token, user, and profile from both store and storage
  logout: async () => {
    try {
      await removeStorageItems([TOKEN_KEY, USER_KEY, PROFILE_KEY]);
      set({
        token: null,
        user: null,
        profile: null,
        error: null,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  },

  clearError: () => set({ error: null }),
}));

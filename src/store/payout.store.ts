import { create } from 'zustand';
import {
  getNigerianBanks,
  getPayoutDestinationsAPI,
  addPayoutDestinationAPI,
  deletePayoutDestinationAPI,
  resolveAccountAPI,
  getSellerBalanceAPI,
  getSellerLedgerAPI,
  requestPayoutAPI,
  request2FAAAPI,
} from '../services/api';
import { PayoutState, Bank, PayoutDestination, AccountResolution, SellerBalance, LedgerEntry } from '../types/payout.types';

export const usePayoutStore = create<PayoutState>((set, get) => ({
  nigerianBanks: [],
  payoutDestinations: [],
  resolvedAccount: null,
  balance: null,
  ledger: [],
  isLoading: false,
  error: null,

  getBanks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getNigerianBanks();
      let banks: Bank[] = [];
      if (response.success && response.data) {
        banks = response.data;
      } else if (Array.isArray(response.data)) {
        banks = response.data;
      }
      set({ nigerianBanks: banks, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch banks';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getPayoutDestinations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getPayoutDestinationsAPI();
      let destinations: PayoutDestination[] = [];
      if (response.success && response.data) {
        destinations = response.data;
      } else if (Array.isArray(response.data)) {
        destinations = response.data;
      }
      set({ payoutDestinations: destinations, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payout destinations';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  addPayoutDestination: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await addPayoutDestinationAPI(payload);
      if (response.success) {
        await get().getPayoutDestinations(); // Refresh list
        set({ isLoading: false });
      } else {
        set({ error: response.message || 'Failed to add payout destination', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add payout destination';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deletePayoutDestination: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deletePayoutDestinationAPI(id);
      if (response.success) {
        await get().getPayoutDestinations(); // Refresh list
        set({ isLoading: false });
      } else {
        set({ error: response.message || 'Failed to delete payout destination', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete payout destination';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  resolveAccount: async (bankCode, accountNumber) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resolveAccountAPI(bankCode, accountNumber);
      let account: AccountResolution | null = null;
      if (response.success && response.data) {
        account = response.data;
      }
      set({ resolvedAccount: account, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resolve account';
      set({ error: errorMessage, isLoading: false, resolvedAccount: null });
      throw error;
    }
  },

  getSellerBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getSellerBalanceAPI();
      let balance: SellerBalance | null = null;
      if (response.success && response.data) {
        balance = response.data;
      }
      set({ balance, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch balance';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getSellerLedger: async (optionKey, optionValue) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getSellerLedgerAPI(optionKey, optionValue);
      let ledger: LedgerEntry[] = [];
      if (response.success && response.data) {
        ledger = response.data;
      } else if (Array.isArray(response.data)) {
        ledger = response.data;
      }
      set({ ledger, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch ledger';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  requestPayout: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await requestPayoutAPI(payload);
      if (response.success) {
        await get().getSellerBalance(); // Refresh balance
        set({ isLoading: false });
      } else {
        set({ error: response.message || 'Failed to request payout', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request payout';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  request2FA: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await request2FAAAPI();
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to setup 2FA';
      set({ error: errorMessage, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  resetPayout: () => {
    set({
      nigerianBanks: [],
      payoutDestinations: [],
      resolvedAccount: null,
      balance: null,
      ledger: [],
      isLoading: false,
      error: null,
    });
  },
}));

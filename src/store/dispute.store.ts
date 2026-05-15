import { create } from 'zustand';
import { raiseDisputeAPI, getAllDisputesAPI, deleteDisputeAPI } from '../services/api';
import { DisputeState, Dispute } from '../types/dispute.types';

export const useDisputeStore = create<DisputeState>((set, get) => ({
  disputes: [],
  isLoading: false,
  error: null,

  raiseDispute: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await raiseDisputeAPI(payload);
      if (response.success) {
        await get().getAllDisputes(); // Refresh disputes list
        set({ isLoading: false });
      } else {
        set({ error: response.message || 'Failed to raise dispute', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to raise dispute';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getAllDisputes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getAllDisputesAPI();
      let disputes: Dispute[] = [];
      if (response.success && response.data) {
        disputes = response.data;
      } else if (Array.isArray(response.data)) {
        disputes = response.data;
      }
      set({ disputes, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch disputes';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteDispute: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deleteDisputeAPI(id);
      if (response.success) {
        await get().getAllDisputes(); // Refresh list
        set({ isLoading: false });
      } else {
        set({ error: response.message || 'Failed to delete dispute', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete dispute';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  resetDisputes: () => {
    set({
      disputes: [],
      isLoading: false,
      error: null,
    });
  },
}));

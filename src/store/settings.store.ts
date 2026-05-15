import { create } from 'zustand';
import { request2FAAAPI, getActivityLogsAPI } from '../services/api';
import { SettingsState, ActivityLog } from '../types/settings.types';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  activityLogs: [],
  twoFAData: null,
  isLoading: false,
  error: null,

  request2FA: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await request2FAAAPI();
      if (response.success && response.data) {
        set({ twoFAData: response.data, isLoading: false });
        return response.data;
      } else {
        set({ error: response.message || 'Failed to setup 2FA', isLoading: false });
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to setup 2FA';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getActivityLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getActivityLogsAPI();
      let logs: ActivityLog[] = [];
      if (response.success && response.data?.logs) {
        logs = response.data.logs;
      } else if (Array.isArray(response.data)) {
        logs = response.data;
      }
      set({ activityLogs: logs, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch activity logs';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  resetSettings: () => {
    set({
      activityLogs: [],
      twoFAData: null,
      isLoading: false,
      error: null,
    });
  },
}));

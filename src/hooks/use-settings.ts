import { useSettingsStore } from '../store/settings.store';

export const useSettings = () => {
  const { activityLogs, twoFAData, isLoading, error, request2FA, getActivityLogs, clearError, resetSettings } = useSettingsStore();

  return {
    activityLogs,
    twoFAData,
    isLoading,
    error,
    request2FA,
    getActivityLogs,
    clearError,
    resetSettings,
  };
};

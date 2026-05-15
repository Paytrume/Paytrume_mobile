export interface ActivityLog {
  _id: string;
  action: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  [key: string]: any;
}

export interface SettingsState {
  activityLogs: ActivityLog[];
  twoFAData: {
    secret: string;
    otpauth_url: string;
  } | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  request2FA: () => Promise<any>;
  getActivityLogs: () => Promise<void>;
  clearError: () => void;
  resetSettings: () => void;
}

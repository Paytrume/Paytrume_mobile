export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface OtpFormData {
  otp: string;
}

export interface NewPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export interface UseRegistrationReturn {
  form: any; // React Hook Form instance
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface UsePasswordResetReturn {
  isLoadingEmail: boolean;
  isLoadingOtp: boolean;
  isLoadingReset: boolean;
  otpTimer: number;
  error: string | null;
  sendEmail: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

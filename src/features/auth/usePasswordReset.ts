import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { forgotPasswordGenerateOtp, forgotPasswordResetWithOtp } from '../../services/api';
import { showErrorToast } from '../../utils/toast';

export const usePasswordReset = () => {
  const router = useRouter();
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startOtpTimer = useCallback(() => {
    setOtpTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const sendEmail = async (email: string) => {
    setIsLoadingEmail(true);
    setError(null);
    try {
      const response = await forgotPasswordGenerateOtp(email);

      if (response.success) {
        startOtpTimer();
        // Navigate to OTP verification with email in query params
        router.push(`/(auth)/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        const errorMsg = response.message || 'Failed to send reset email';
        setError(errorMsg);
        showErrorToast(errorMsg, 'long');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || (err instanceof Error ? err.message : 'Failed to send reset email');
      setError(msg);
      showErrorToast(msg, 'long');
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setIsLoadingOtp(true);
    setError(null);
    try {
      // Just navigate to new password form with email and otp
      // The actual verification happens when password is submitted
      router.push(`/(auth)/create-new-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to proceed';
      setError(msg);
      showErrorToast(msg, 'long');
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const resendOtp = async (email: string) => {
    setError(null);
    try {
      const response = await forgotPasswordGenerateOtp(email);

      if (response.success) {
        startOtpTimer();
        showErrorToast('OTP sent to your email', 'short');
      } else {
        const errorMsg = response.message || 'Failed to resend OTP';
        setError(errorMsg);
        showErrorToast(errorMsg, 'long');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || (err instanceof Error ? err.message : 'Failed to resend OTP');
      setError(msg);
      showErrorToast(msg, 'long');
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    setIsLoadingReset(true);
    setError(null);
    try {
      const response = await forgotPasswordResetWithOtp(email, otp, newPassword);

      if (response.success) {
        Alert.alert('Success', 'Password reset successfully. Please login with your new password.', [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]);
      } else {
        const errorMsg = response.message || 'Failed to reset password';
        setError(errorMsg);
        showErrorToast(errorMsg, 'long');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || (err instanceof Error ? err.message : 'Failed to reset password');
      setError(msg);
      showErrorToast(msg, 'long');
    } finally {
      setIsLoadingReset(false);
    }
  };

  return {
    isLoadingEmail,
    isLoadingOtp,
    isLoadingReset,
    otpTimer,
    error,
    sendEmail,
    verifyOtp,
    resendOtp,
    resetPassword,
    startOtpTimer,
  };
};

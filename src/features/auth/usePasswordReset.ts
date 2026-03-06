import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

export const usePasswordReset = () => {
  const router = useRouter();
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      startOtpTimer();
      // navigate including email as query
      router.push(`/(auth)/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(msg);
      Alert.alert('Error', msg);
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setIsLoadingOtp(true);
    setError(null);
    try {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // mock validation
      if (otp !== '123456') {
        throw new Error('Invalid OTP');
      }
      router.push(`/(auth)/create-new-password?email=${encodeURIComponent(email)}&token=reset-token`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(msg);
      Alert.alert('Error', msg);
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const resendOtp = async (email: string) => {
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      startOtpTimer();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(msg);
      Alert.alert('Error', msg);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoadingReset(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Password reset successfully', [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reset password';
      setError(msg);
      Alert.alert('Error', msg);
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

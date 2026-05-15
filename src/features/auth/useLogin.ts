import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/auth.store';
import { showErrorToast } from '../../utils/toast';
import { LoginFormData, loginSchema } from './auth.schema';

export const useLogin = () => {
  const router = useRouter();
  const { loginSeller, loading } = useAuthStore();
  const [displayError, setDisplayError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setDisplayError(null);

      // Call the seller login API through Zustand store
      await loginSeller({
        email: data.email,
        password: data.password,
        trusted: false,
      });

      // On success, navigate to tabs
      router.push('/(tabs)');
    } catch (err) {
      // Error is already set in the store
      const storeError = useAuthStore.getState().error;

      if (storeError) {
        if (storeError.type === 'network') {
          // Network error - display on screen, don't navigate
          setDisplayError(storeError.message);
        } else {
          // Server error - show as toast
          showErrorToast(storeError.message, 'long');
        }
      } else {
        // Fallback error handling
        const errorMessage = err instanceof Error ? err.message : 'Failed to login';
        setDisplayError(errorMessage);
      }
    }
  };

  return {
    form,
    onSubmit,
    isLoading: loading,
    error: displayError,
  };
};

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { useAuthStore } from '../../store/auth.store';
import { showErrorToast } from '../../utils/toast';
import { RegistrationFormData, registrationSchema } from './auth.schema';

export const useRegistration = () => {
  const router = useRouter();
  const { signupSeller, loading, error } = useAuthStore();
  const [displayError, setDisplayError] = useState<string | null>(null);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setDisplayError(null);

      // Split full name into first and last name
      const [first_name, ...lastNameParts] = data.fullName.split(' ');
      const last_name = lastNameParts.join(' ') || '';

      // Call the seller signup API through Zustand store
      await signupSeller({
        first_name,
        last_name,
        email: data.email,
        password: data.password,
        mobile: data.phone,
      });

      // On success, navigate to next screen
      Alert.alert('Success', 'Account created successfully!', [{ text: 'OK', onPress: () => router.push('/(tabs)') }]);
    } catch (err) {
      // Error is already set in the store
      // Extract error information
      const storeError = useAuthStore.getState().error;

      if (storeError) {
        console.log('Signup error:', storeError);
        if (storeError.type === 'network') {
          // Network error - display on screen, don't navigate
          setDisplayError(storeError.message);
        } else {
          // Server error - show as toast
          showErrorToast(storeError.message, 'long');
        }
      } else {
        // Fallback error handling
        const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
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

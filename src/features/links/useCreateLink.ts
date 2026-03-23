// src/features/links/useCreateLink.ts
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { CreateLinkFormData } from './links.types';

export const useCreateLink = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLink = async (data: CreateLinkFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual link creation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert('Link Created', 'Your secure payment link has been created and sent to the customer.', [{ text: 'OK', onPress: () => router.back() }]);

      return true;
    } catch (err) {
      setError('Failed to create link. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createLink,
    isLoading,
    error,
  };
};

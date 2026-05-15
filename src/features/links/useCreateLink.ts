// src/features/links/useCreateLink.ts
import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { createProduct } from '../../services/api';
import { uploadImageToCloudinary } from '../../utils/cloudinary';
import { CreateLinkFormData } from './links.types';
import { useProductsStore } from '@/store/products.store';

export const useCreateLink = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { fetchProducts } = useProductsStore();


  const createLink = async (data: CreateLinkFormData) => {
    setIsLoading(true);
    setUploadProgress(0);
    setError(null);

    try {
      let imageUrl = '';

      // Upload image to Cloudinary if provided
      if (data.coverPhoto) {
        try {
          imageUrl = await uploadImageToCloudinary(data.coverPhoto, (progress) => {
            setUploadProgress(progress);
          });
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr);
          setError('Failed to upload image. Please try again.');
          Alert.alert('Image Upload Failed', 'Failed to upload image. Please try again.');
          setIsLoading(false);
          return false;
        }
      }

      // Map form data to API request format
      const productData = {
        product_name: data.name,
        product_description: data.description,
        product_price: data.cost,
        buyer_email: data.customerEmail,
        buyer_phone: data.customerPhone,
        type: data.type === 'goods' ? 'goods' : data.type,
        product_images: imageUrl,
        ...(data.type === 'services' && {
          payment_type: data.paymentType,
          payment_category: data.recurringCategory,
          percent_rate: data.recurringRate ? parseInt(data.recurringRate) : 0,
        }),
      };

      const response = await createProduct(productData);

      if (response.success) {
        Alert.alert('Link Created', 'Your secure payment link has been created and sent to the customer.', [{ text: 'OK', onPress: () => router.back() }]);
        fetchProducts(0);
        return true;
      } else {
        setError(response.message || 'Failed to create link. Please try again.');
        Alert.alert('Error', response.message || 'Failed to create link. Please try again.');
        return false;
      }
    } catch (err) {
      const errorMessage = isAxiosError(err) ? err.response?.data?.message || err.message : err instanceof Error ? err.message : 'Failed to create link. Please try again.';

      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return {
    createLink,
    isLoading,
    uploadProgress,
    error,
  };
};

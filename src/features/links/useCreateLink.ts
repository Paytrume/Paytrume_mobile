// src/features/links/useCreateLink.ts
import { useProductsStore } from '@/store/products.store';
import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { createProduct } from '../../services/api';
import { uploadImageToCloudinary } from '../../utils/cloudinary';
import { CreateLinkFormData } from './links.types';

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
        console.log('📸 Starting image upload process...');
        console.log('📸 Image URI:', data.coverPhoto);

        try {
          console.log('☁️ Uploading to Cloudinary...');
          imageUrl = await uploadImageToCloudinary(data.coverPhoto, (progress) => {
            console.log(`📊 Cloudinary upload progress: ${progress}%`);
            setUploadProgress(progress);
          });
          console.log('✅ Cloudinary upload successful! URL:', imageUrl);
        } catch (uploadErr) {
          console.error('❌ Cloudinary upload failed:', uploadErr);
          const errorMessage = uploadErr instanceof Error ? uploadErr.message : 'Failed to upload image. Please try again.';
          setError(errorMessage);
          Alert.alert('Image Upload Failed', errorMessage);
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

      console.log('📤 Sending product data to API:', {
        product_name: productData.product_name,
        product_price: productData.product_price,
        type: productData.type,
        product_images: productData.product_images?.substring(0, 50) + '...',
      });

      const response = await createProduct(productData);

      console.log('✅ API response:', response);

      if (response.success) {
        Alert.alert('Link Created', 'Your secure payment link has been created and sent to the customer.', [{ text: 'OK', onPress: () => router.back() }]);
        fetchProducts(0);
        return true;
      } else {
        const errorMsg = response.message || 'Failed to create link. Please try again.';
        setError(errorMsg);
        Alert.alert('Error', errorMsg);
        return false;
      }
    } catch (err) {
      console.error('❌ Create link error:', err);

      let errorMessage = 'Failed to create link. Please try again.';

      if (isAxiosError(err)) {
        console.error('❌ API Error details:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

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

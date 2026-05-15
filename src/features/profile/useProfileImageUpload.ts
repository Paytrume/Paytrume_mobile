import { useState } from 'react';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

export const useProfileImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadAvatarImage = async (imageUri: string | undefined): Promise<string | undefined> => {
    if (!imageUri) {
      return undefined;
    }

    // If it's already a Cloudinary URL (starts with https://), return it as is
    if (imageUri.startsWith('https://')) {
      return imageUri;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrl = await uploadImageToCloudinary(imageUri, (progress) => {
        setUploadProgress(progress);
      });
      return uploadedUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadAvatarImage,
    uploadProgress,
    isUploading,
  };
};

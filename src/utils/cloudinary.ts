import axios from 'axios';

// Cloudinary configuration
const CLOUD_NAME = 'ifezulike';
const UPLOAD_PRESET = 'hbcyue9x';

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  [key: string]: any;
}

/**
 * Upload an image to Cloudinary
 * @param imageUri - Local file URI (file://) from image picker
 * @param onProgress - Optional callback for upload progress
 * @returns secure_url of uploaded image
 */
export const uploadImageToCloudinary = async (imageUri: string, onProgress?: (progress: number) => void): Promise<string> => {
  try {
    if (!imageUri) {
      throw new Error('No image URI provided');
    }

    console.log('🔧 Starting Cloudinary upload with URI:', imageUri);

    // Determine file type from URI
    const fileType = imageUri.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';
    const fileName = imageUri.split('/').pop() || 'upload.jpg';

    // Create FormData - correct way for React Native
    const formData = new FormData();

    formData.append('file', {
      uri: imageUri,
      type: fileType,
      name: fileName,
    } as any);

    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);

    console.log('📤 FormData created, uploading to Cloudinary...');

    // Upload to Cloudinary
    const response = await axios.post<CloudinaryUploadResponse>(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          console.log(`📊 Upload progress: ${progress}%`);
          onProgress(progress);
        }
      },
    });

    console.log('✅ Cloudinary response received:', {
      public_id: response.data.public_id,
      secure_url: response.data.secure_url?.substring(0, 50) + '...',
    });

    if (response.data.secure_url) {
      console.log('✅ Upload successful!');
      return response.data.secure_url;
    } else {
      throw new Error('No secure_url in response from Cloudinary');
    }
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);

    let errorMessage = 'Failed to upload image to Cloudinary';

    if (axios.isAxiosError(error)) {
      console.error('❌ Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      errorMessage = error.response?.data?.error?.message || error.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('❌ Final error message:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param imageUris - Array of local file URIs
 * @param onProgress - Optional callback for overall progress
 * @returns Array of secure_urls
 */
export const uploadMultipleImagesToCloudinary = async (imageUris: string[], onProgress?: (current: number, total: number) => void): Promise<string[]> => {
  try {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < imageUris.length; i++) {
      const url = await uploadImageToCloudinary(imageUris[i]);
      uploadedUrls.push(url);
      onProgress?.(i + 1, imageUris.length);
    }

    return uploadedUrls;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

export default {
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
};

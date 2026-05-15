import axios from 'axios';
import { File } from 'expo-file-system';
import { Alert } from 'react-native';

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

    // Read file as base64
    const file = new File(imageUri);
    const base64Data = await file.base64();

    // Determine file type from URI
    const fileType = imageUri.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';

    // Create FormData
    const formData = new FormData();

    formData.append('file', {
      uri: imageUri,
      type: imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg',
      name: 'upload.jpg',
    } as any);

    formData.append('upload_preset', UPLOAD_PRESET);

    // Upload to Cloudinary
    const response = await axios.post<CloudinaryUploadResponse>(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(progress);
        }
      },
    });

    console.log('Cloudinary response:', response.data);

    if (response.data.secure_url) {
      return response.data.secure_url;
    } else {
      throw new Error('No secure_url in response');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
    Alert.alert('Upload Error', errorMessage);
    throw error;
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

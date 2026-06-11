import * as ImagePicker from 'expo-image-picker';
import { Camera, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme';
import { Text } from '../typography/Text';

interface PhotoUploaderProps {
  onImageSelected?: (uri: string) => void;
  onImageRemoved?: () => void;
  maxSizeMB?: number;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onImageSelected, onImageRemoved, maxSizeMB = 5 }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    return cameraStatus === 'granted' && libraryStatus === 'granted';
  };

  const checkImageSize = (uri: string): Promise<boolean> => {
    return new Promise((resolve) => {
      Image.getSize(
        uri,
        (width, height) => {
          // You can also check file size here if needed
          resolve(true);
        },
        () => {
          resolve(false);
        },
      );
    });
  };

  const pickImage = async (useCamera: boolean) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please grant camera and photo library permissions to upload photos.');
      return;
    }

    setIsLoading(true);
    try {
      const options = {
        mediaTypes: 'images' as const,
        allowsEditing: true,
        quality: 1,
      };

      console.log('📸 Launching image picker with options:', options);
      const result = useCamera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);

      console.log('📸 ImagePicker result:', {
        canceled: result.canceled,
        assetCount: result.assets?.length || 0,
        firstAssetUri: result.assets?.[0]?.uri,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedUri = result.assets[0].uri;
        console.log('✅ Selected image URI:', selectedUri);
        console.log('✅ URI starts with file://', selectedUri.startsWith('file://'));

        // Store and pass local URI to parent - parent will handle Cloudinary upload
        setImage(selectedUri);
        onImageSelected?.(selectedUri);
        console.log('✅ Image URI passed to parent component');
      } else {
        console.warn('⚠️ Image picker was canceled');
      }
    } catch (error) {
      console.error('❌ Image picker error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to select image';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const showOptions = () => {
    Alert.alert('Upload Cover Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: () => pickImage(true) },
      { text: 'Choose from Library', onPress: () => pickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removeImage = () => {
    setImage(null);
    onImageRemoved?.();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  if (image) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: image }} style={styles.previewImage} />
        <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
          <X size={20} color={theme.colors.white} />
        </TouchableOpacity>
        <Text variant='small' color={theme.colors.text.tertiary} style={styles.fileHint}>
          JPG, PNG up to {maxSizeMB}MB
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={showOptions}>
      <View style={styles.uploadArea}>
        <View style={styles.iconContainer}>
          <Camera size={32} color={theme.colors.primary} />
        </View>
        <Text variant='body' style={styles.uploadText}>
          Tap to upload a photo
        </Text>
        <Text variant='small' color={theme.colors.text.tertiary}>
          JPG, PNG up to {maxSizeMB}MB
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 16,
    position: 'relative',
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${theme.colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadText: {
    fontWeight: '500',
    marginBottom: 4,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileHint: {
    marginTop: 8,
    textAlign: 'center',
  },
});

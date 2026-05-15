import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Secure storage adapter that works with Expo managed workflow
 * Uses expo-secure-store for iOS/Android
 * Falls back to in-memory storage for web and development
 */

// In-memory fallback storage
const memoryStorage: Record<string, string> = {};

const isWeb = Platform.OS === 'web';

/**
 * Set a value in secure storage
 */
export const setStorageItem = async (key: string, value: string): Promise<void> => {
  try {
    if (isWeb) {
      // Web uses in-memory storage
      memoryStorage[key] = value;
    } else {
      // Native platforms use expo-secure-store
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Failed to set storage item "${key}":`, error);
    // Fallback to in-memory storage
    memoryStorage[key] = value;
  }
};

/**
 * Get a value from secure storage
 */
export const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    if (isWeb) {
      // Web uses in-memory storage
      return memoryStorage[key] || null;
    } else {
      // Native platforms use expo-secure-store
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`Failed to get storage item "${key}":`, error);
    // Fallback to in-memory storage
    return memoryStorage[key] || null;
  }
};

/**
 * Remove a value from secure storage
 */
export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    if (isWeb) {
      // Web uses in-memory storage
      delete memoryStorage[key];
    } else {
      // Native platforms use expo-secure-store
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Failed to remove storage item "${key}":`, error);
    // Fallback to in-memory storage
    delete memoryStorage[key];
  }
};

/**
 * Remove multiple items from storage
 */
export const removeStorageItems = async (keys: string[]): Promise<void> => {
  await Promise.all(keys.map((key) => removeStorageItem(key)));
};

export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

export default {
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  removeStorageItems,
};

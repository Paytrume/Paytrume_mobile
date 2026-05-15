import { Alert, Platform, ToastAndroid } from 'react-native';

export type ToastDuration = 'short' | 'long';

/**
 * Display a toast notification
 * On Android: Uses native ToastAndroid
 * On iOS: Uses Alert (since iOS doesn't have native toast)
 */
export const showToast = (message: string, duration: ToastDuration = 'short'): void => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, duration === 'short' ? ToastAndroid.SHORT : ToastAndroid.LONG);
  } else {
    // iOS - using setTimeout to auto-dismiss (simplified toast effect)
    Alert.alert('', message, [{ text: 'OK' }], { cancelable: true });
  }
};

/**
 * Display a success toast
 */
export const showSuccessToast = (message: string = 'Success!', duration: ToastDuration = 'short'): void => {
  showToast(message, duration);
};

/**
 * Display an error toast
 */
export const showErrorToast = (message: string = 'An error occurred', duration: ToastDuration = 'long'): void => {
  showToast(message, duration);
};

export default {
  showToast,
  showSuccessToast,
  showErrorToast,
};

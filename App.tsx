import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAuthStore } from './src/store/auth.store';

// keep expo-router entry import to bootstrap routing
import 'expo-router/entry';

// prevent the splash screen from auto-hiding while we load fonts
SplashScreen.preventAutoHideAsync();

export default function App() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    // make sure you add the corresponding .ttf files to `assets/fonts`
    // you can download Plus Jakarta Sans from Google Fonts and drop
    // the regular/bold/italic files into that folder.
    'PlusJakartaSans-Regular': require('./assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Bold': require('./assets/fonts/PlusJakartaSans-Bold.ttf'),
    // add other variants as needed
  });

  const { hydrate, token } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      // Hydrate auth store to load token from AsyncStorage
      await hydrate();
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      }
    };

    if (!token) {
      router.replace('/(auth)/login');
    }

    initialize();
  }, [fontsLoaded, hydrate, token]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      console.log(data);

      // Navigate to screen
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    // while loading keep showing the splash screen
    return null;
  }

  // returning nothing is fine; expo-router/entry takes over
  return null;
}

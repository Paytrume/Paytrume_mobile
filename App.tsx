import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useAuthStore } from './src/store/auth.store';

// keep expo-router entry import to bootstrap routing
import 'expo-router/entry';

// prevent the splash screen from auto-hiding while we load fonts
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    // make sure you add the corresponding .ttf files to `assets/fonts`
    // you can download Plus Jakarta Sans from Google Fonts and drop
    // the regular/bold/italic files into that folder.
    'PlusJakartaSans-Regular': require('./assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Bold': require('./assets/fonts/PlusJakartaSans-Bold.ttf'),
    // add other variants as needed
  });

  const { hydrate } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      // Hydrate auth store to load token from AsyncStorage
      await hydrate();
      if (fontsLoaded) {
        SplashScreen.hideAsync();
      }
    };

    initialize();
  }, [fontsLoaded, hydrate]);

  if (!fontsLoaded) {
    // while loading keep showing the splash screen
    return null;
  }

  // returning nothing is fine; expo-router/entry takes over
  return null;
}

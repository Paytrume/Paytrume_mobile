import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { WalletScreen } from '../../features/home/screens/WalletScreen';

import { Stack, useRouter } from 'expo-router';


import { theme } from '@/theme';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
export default function CreateNewPasswordScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Wallet',
          headerTintColor: theme.colors.primary,
          headerStyle: styles.headBg,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <WalletScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  headBg: { backgroundColor: `${theme.colors.primary}15` },
  headerButton: {
    padding: 8,
  },
});

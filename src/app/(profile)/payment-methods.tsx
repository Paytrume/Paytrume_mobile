import { theme } from '@/theme';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { PaymentMethodsScreen } from '../../features/profile/components/PaymentMethodsScreen';

export default function PaymentMethodsPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Payment Methods',
          headerTintColor: theme.colors.primary,
          headerStyle: styles.headBg,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <PaymentMethodsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  headBg: {
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerButton: {
    marginLeft: 8,
    padding: 8,
  },
});

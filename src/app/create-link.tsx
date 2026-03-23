import { Stack, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { CreateLinkForm } from '../features/links/components/CreateLinkForm';
import { theme } from '../theme';

export default function CreateLinkScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Create Link',
          headerTintColor: theme.colors.primary,
          headerStyle: styles.headBg,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <CreateLinkForm />
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
    marginLeft: 8,
  },
});

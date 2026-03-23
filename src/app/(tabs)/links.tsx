import { Stack, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinksList } from '../../features/links/components/LinksList';
import { theme } from '../../theme';

export default function LinksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Your links',
          headerTintColor: theme.colors.primary,
          headerStyle: styles.headBg,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ChevronLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <LinksList />
      {/* <FloatingActionButton /> */}
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

import React, { useRef } from 'react';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Animated, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinksList } from '../features/links/components/LinksList';
import { theme } from '../theme';

export default function LinksScreen() {
  const router = useRouter();

  const scrollY = useRef(new Animated.Value(0)).current;

  // Animate FAB position based on scroll
  const fabTranslateY = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, -20, -40],
    extrapolate: 'clamp',
  });

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
      <Animated.View style={[styles.fabContainer, { transform: [{ translateY: fabTranslateY }] }]}>
        <FloatingActionButton />
      </Animated.View>
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
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    right: 54,
    zIndex: 999,
  },
});

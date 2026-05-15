// src/app/(tabs)/profile.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ProfileScreen } from '../../features/profile/components/ProfileScreen';
import { theme } from '../../theme';
import { Stack } from 'expo-router';

export default function ProfileTabScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Profile',
          headerTintColor: theme.colors.primary,
        }}
      /> */}
      <ProfileScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
});

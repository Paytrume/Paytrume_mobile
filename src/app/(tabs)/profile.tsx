// src/app/(tabs)/profile.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/typography/Text';

export default function ProfileScreen() {
  return (
    <Screen style={styles.container}>
      <Text variant='h2'>Profile</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

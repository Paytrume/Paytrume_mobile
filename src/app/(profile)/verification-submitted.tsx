// src/app/(profile)/verification-submitted.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { Text } from '../../components/typography/Text';
import { Button } from '../../components/ui/Button';
import { theme } from '../../theme';

export default function VerificationSubmittedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <CheckCircle2 size={80} color={theme.colors.state.success} />
        </View>

        <Text variant='h1' style={styles.title}>
          Documents submitted
        </Text>

        <Text variant='body' color={theme.colors.text.secondary} style={styles.message}>
          We will review your documents and respond as required.
        </Text>

        <Button title='Back to Profile' onPress={() => router.push('/(tabs)/profile')} style={styles.button} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  button: {
    width: '100%',
  },
});

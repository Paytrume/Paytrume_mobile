// src/app/_layout.tsx (simplified)
import { Stack } from 'expo-router';
import { useAuth } from '../hooks/use-auth';

export default function Layout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? <Stack.Screen name='(auth)' /> : <Stack.Screen name='(tabs)' />}
      <Stack.Screen name='create-link' />
    </Stack>
  );
}

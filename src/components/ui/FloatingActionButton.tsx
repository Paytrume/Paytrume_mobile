// src/components/ui/FloatingActionButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { theme } from '../../theme';
import { useRouter } from 'expo-router';

export const FloatingActionButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.fab} onPress={() => router.push('/create-link')} activeOpacity={0.8}>
      <Plus size={32} color='#FFFFFF' />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30, // Position above the tab bar
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
});

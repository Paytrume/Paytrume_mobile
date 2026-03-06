import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../../theme';
import { Text } from '../typography/Text';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<Props> = ({ title, onPress, style, variant = 'primary', textColor, disabled = false, loading = false }) => {
  const backgroundColor = disabled ? theme.colors.background.tertiary : variant === 'secondary' ? theme.colors.background.tertiary : theme.colors.primary;

  const finalTextColor = textColor || (variant === 'secondary' ? theme.colors.text.primary : '#fff');

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }, style]} onPress={handlePress} disabled={disabled || loading} accessibilityState={{ disabled: disabled || loading }}>
      {loading ? (
        <ActivityIndicator color={finalTextColor} size='small' />
      ) : (
        <Text color={finalTextColor} style={styles.text}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
});

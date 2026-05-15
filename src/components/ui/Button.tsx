import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, ViewStyle, View } from 'react-native';
import { theme } from '../../theme';
import { Text } from '../typography/Text';
import { LucideIcon } from 'lucide-react-native';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  variant?: 'primary' | 'secondary';
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
}

export const Button: React.FC<Props> = ({ title, onPress, style, variant = 'primary', textColor, disabled = false, loading = false, icon: Icon }) => {
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
        <View style={styles.content}>
          {Icon && <Icon size={18} color={finalTextColor} style={styles.icon} />}

          <Text color={finalTextColor} style={styles.text}>
            {title}
          </Text>
        </View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontWeight: '600',
  },
});

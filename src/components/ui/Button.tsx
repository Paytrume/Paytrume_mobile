import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../../theme';
import { Text } from '../typography/Text';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
  textColor?: string;
}

export const Button: React.FC<Props> = ({ title, onPress, style, variant = 'primary', textColor }) => {
  const backgroundColor = variant === 'secondary' ? theme.colors.button.primaryWithOpacity15 : theme.colors.primary;
  const finalTextColor = textColor || (variant === 'secondary' ? theme.colors.text.primary : '#fff');

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }, style]} onPress={onPress}>
      <Text color={finalTextColor} style={styles.text}>
        {title}
      </Text>
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

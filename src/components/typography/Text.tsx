import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { theme } from '../../theme';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'small';

interface Props extends TextProps {
  variant?: Variant;
  color?: string; // Still accept string
}

export const Text: React.FC<Props> = ({ variant = 'body', color, style, ...props }) => {
  const textColor = color || theme.colors.text.primary;

  return <RNText style={[styles[variant], { color: textColor }, style]} {...props} />;
};

const styles = StyleSheet.create({
  h1: theme.typography.h1,
  h2: theme.typography.h2,
  h3: theme.typography.h3,
  body: theme.typography.body,
  small: theme.typography.small,
});

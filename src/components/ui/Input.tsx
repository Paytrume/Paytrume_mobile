import * as Icons from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { theme } from '../../theme';
import { Text } from '../typography/Text';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  showPasswordToggle?: boolean;
  onPasswordToggle?: () => void;
  isPasswordVisible?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  touched,
  onBlur,
  onFocus,
  showPasswordToggle = false,
  onPasswordToggle,
  isPasswordVisible = false,
}) => {
  const isFocused = useSharedValue(0);
  const hasError = useSharedValue(error ? 1 : 0);

  const handleFocus = () => {
    isFocused.value = withTiming(1, { duration: 200 });
    onFocus?.();
  };

  const handleBlur = () => {
    isFocused.value = withTiming(0, { duration: 200 });
    onBlur?.();
  };

  React.useEffect(() => {
    hasError.value = withTiming(error ? 1 : 0, { duration: 200 });
  }, [error, hasError]);

  const animatedStyles = useAnimatedStyle(() => {
    const borderColor = interpolateColor(isFocused.value, [0, 1], [theme.colors.border.medium, theme.colors.primary]);

    const errorBorderColor = interpolateColor(hasError.value, [0, 1], [borderColor, theme.colors.state.error]);

    return {
      borderColor: errorBorderColor,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: withTiming(isFocused.value * 0.25, { duration: 200 }),
      shadowRadius: withTiming(isFocused.value * 8, { duration: 200 }),
      elevation: withTiming(isFocused.value * 4, { duration: 200 }),
    };
  });

  return (
    <View style={styles.container}>
      <Text variant='body' style={styles.label}>
        {label}
      </Text>

      <Animated.View style={[styles.inputContainer, animatedStyles]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label}
          accessibilityHint={placeholder}
        />

        {showPasswordToggle && (
          <TouchableOpacity onPress={onPasswordToggle} style={styles.iconContainer} accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}>
            {isPasswordVisible ? <Icons.EyeOff size={20} color={theme.colors.text.secondary} /> : <Icons.Eye size={20} color={theme.colors.text.secondary} />}
          </TouchableOpacity>
        )}
      </Animated.View>

      {error && touched && (
        <Text variant='small' color={theme.colors.state.error} style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingVertical: 0, // Remove default padding to align with container
  },
  iconContainer: {
    padding: 4,
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
  },
});

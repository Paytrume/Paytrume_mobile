import * as Icons from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { theme } from '../../theme';
import { Text } from '../typography/Text';
import { LucideIcon } from 'lucide-react-native';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
  error?: string;
  touched?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  showPasswordToggle?: boolean;
  onPasswordToggle?: () => void;
  isPasswordVisible?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  autoCorrect?: boolean;

  // ✅ NEW
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
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
  multiline = false,
  numberOfLines,
  style,
  textAlignVertical = multiline ? 'top' : 'center',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
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
  }, [error]);

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
      {!!label && (
        <Text variant='body' style={styles.label}>
          {label}
        </Text>
      )}

      <Animated.View style={[styles.inputContainer, animatedStyles, style]}>
        {/* ✅ LEFT ICON */}
        {LeftIcon && (
          <View style={styles.leftIcon}>
            <LeftIcon size={20} color={theme.colors.text.secondary} />
          </View>
        )}

        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          textAlignVertical={textAlignVertical}
          accessibilityLabel={label}
          accessibilityHint={placeholder}
        />

        {/* ✅ PASSWORD TOGGLE OR RIGHT ICON */}
        {showPasswordToggle ? (
          <TouchableOpacity onPress={onPasswordToggle} style={styles.iconContainer}>
            {isPasswordVisible ? <Icons.EyeOff size={20} color={theme.colors.text.secondary} /> : <Icons.Eye size={20} color={theme.colors.text.secondary} />}
          </TouchableOpacity>
        ) : (
          RightIcon && (
            <View style={styles.iconContainer}>
              <RightIcon size={20} color={theme.colors.text.secondary} />
            </View>
          )
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
    borderRadius: 8, // slightly nicer for search
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
    paddingBottom: 8,
  },
  leftIcon: {
    marginRight: 8,
  },
  iconContainer: {
    marginLeft: 8,
    padding: 4,
  },
  errorText: {
    marginTop: 4,
  },
});
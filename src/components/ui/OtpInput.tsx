import * as React from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { theme } from '../../theme';
// using Expo's clipboard for better compatibility
// @ts-ignore: types may not be installed yet
import * as Clipboard from 'expo-clipboard';

interface OtpInputProps {
  code: string;
  setCode: (code: string) => void;
  onComplete?: (code: string) => void;
  error?: string;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({ code, setCode, onComplete, error, isLoading = false, autoFocus = true }) => {
  const inputsRef = React.useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);

  const shakeAnim = useSharedValue(0);

  React.useEffect(() => {
    if (error && code.length === 6) {
      shakeAnim.value = withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 50 }), withTiming(-8, { duration: 50 }), withTiming(0, { duration: 50 }));
    }
  }, [error, code, shakeAnim]);

  const handleChange = (text: string, index: number) => {
    // if pasted or multiple chars
    if (text.length > 1) {
      const filtered = text.replace(/\D/g, '').slice(0, 6);
      setCode(filtered);
      if (filtered.length === 6) {
        onComplete && onComplete(filtered);
      }
      return;
    }
    const newCodeArray = code.split('');
    newCodeArray[index] = text;
    const newCode = newCodeArray.join('');
    setCode(newCode);

    if (text && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newCode.length === 6 && !newCode.includes('')) {
      onComplete && onComplete(newCode);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      const newCodeArray = code.split('');
      newCodeArray[index - 1] = '';
      setCode(newCodeArray.join(''));
    }
  };

  const handleFocus = async (idx: number) => {
    setFocusedIndex(idx);
    if (idx === 0 && autoFocus) {
      const clipboardContent = await Clipboard.getStringAsync();
      if (/^\d{6}$/.test(clipboardContent)) {
        setCode(clipboardContent);
        onComplete && onComplete(clipboardContent);
      }
    }
  };

  // digit cell moved to its own component so hooks can be used
  const DigitCell: React.FC<{ digit: string; idx: number }> = ({ digit, idx }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const isFocused = focusedIndex === idx ? 1 : 0;
      const borderColor = error ? theme.colors.state.error : isFocused ? theme.colors.primary : theme.colors.border.medium;
      return {
        borderColor: withTiming(borderColor, { duration: 200 }),
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: withTiming(isFocused ? 0.25 : 0, { duration: 200 }),
        shadowRadius: withTiming(isFocused ? 8 : 0, { duration: 200 }),
        elevation: withTiming(isFocused ? 4 : 0, { duration: 200 }),
        transform: [{ scale: withTiming(isFocused ? 1.05 : 1, { duration: 200 }) }, { translateX: shakeAnim.value }],
      };
    });

    return (
      <Animated.View key={idx} style={[styles.box, animatedStyle]}>
        <TextInput
          ref={(ref) => {
            inputsRef.current[idx] = ref || null;
          }}
          value={digit}
          keyboardType='number-pad'
          maxLength={1}
          style={styles.input}
          onChangeText={(t) => handleChange(t, idx)}
          onKeyPress={(e) => handleKeyPress(e, idx)}
          onFocus={() => handleFocus(idx)}
          editable={!isLoading}
          selectTextOnFocus
        />
      </Animated.View>
    );
  };

  React.useEffect(() => {
    if (autoFocus) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus]);

  // ensure six inputs always rendered
  const cells = Array.from({ length: 6 }, (_, i) => {
    const digit = code[i] || '';
    return <DigitCell digit={digit} idx={i} key={i} />;
  });

  return <View style={styles.container}>{cells}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  box: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    marginHorizontal: 4,
  },
  input: {
    fontSize: 20,
    textAlign: 'center',
    color: theme.colors.text.primary,
    padding: 0,
    width: '100%',
  },
});

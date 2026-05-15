import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaskedTextInput from 'react-native-mask-input';
import { Text } from '../../../components/typography/Text';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { theme } from '../../../theme';
import { useRegistration } from '../useRegistration';

interface RegistrationFormProps {}

export const RegistrationForm: React.FC<RegistrationFormProps> = () => {
  const router = useRouter();
  const { form, onSubmit, isLoading, error } = useRegistration();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = form;

  const handleLoginPress = () => {
    router.push('/(auth)/login');
  };

  const handleTermsPress = () => {
    // Open terms modal or web view
    Alert.alert('Terms & Conditions', 'Terms & Conditions content would be displayed here.');
  };

  const handlePrivacyPress = () => {
    // Open privacy modal or web view
    Alert.alert('Privacy Policy', 'Privacy Policy content would be displayed here.');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        <View style={styles.headerContainer}>
          <Text variant='h1' style={styles.title}>
            Create Account
          </Text>
          <Text variant='body' color={theme.colors.text.secondary} style={styles.subtitle}>
            Get on board with PayTruMe and start selling to your customers or paying merchants in just a few minutes.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name='fullName'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Input label='Full name' value={value} onChangeText={onChange} onBlur={onBlur} placeholder='Enter your full name' error={error?.message} touched={isTouched} autoCapitalize='words' />
            )}
          />

          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Input
                label='Email address'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='Enter your email address'
                keyboardType='email-address'
                autoCapitalize='none'
                error={error?.message}
                touched={isTouched}
              />
            )}
          />

          <Controller
            control={control}
            name='phone'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <View style={styles.phoneInputContainer}>
                <Text variant='body' style={styles.phoneLabel}>
                  Phone number
                </Text>
                <View style={styles.phoneInputWrapper}>
                  <MaskedTextInput
                    style={styles.phoneInput}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder='+1 (555) 123-4567 or any format'
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType='phone-pad'
                    accessibilityLabel='Phone number'
                    accessibilityHint='Enter your phone number in any format'
                  />
                </View>
                {error && isTouched && (
                  <Text variant='small' color={theme.colors.state.error} style={styles.errorText}>
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Input
                label='Password'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='Create a password'
                secureTextEntry={!passwordVisible}
                error={error?.message}
                touched={isTouched}
                showPasswordToggle
                onPasswordToggle={() => setPasswordVisible(!passwordVisible)}
                isPasswordVisible={passwordVisible}
              />
            )}
          />

          <Controller
            control={control}
            name='confirmPassword'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Input
                label='Confirm password'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='Confirm your password'
                secureTextEntry={!confirmPasswordVisible}
                error={error?.message}
                touched={isTouched}
                showPasswordToggle
                onPasswordToggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                isPasswordVisible={confirmPasswordVisible}
              />
            )}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title={isLoading ? 'Creating Account...' : 'Sign up'} onPress={handleSubmit(onSubmit)} style={styles.signUpButton} disabled={!isValid || isLoading} />
          {error && (
            <Text variant='small' color={theme.colors.state.error} style={styles.errorMessage}>
              {error}
            </Text>
          )}
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={handleLoginPress} style={styles.loginLink}>
            <Text variant='body' color={theme.colors.text.secondary}>
              Already have an account?{' '}
              <Text variant='body' color={theme.colors.primary}>
                Log in
              </Text>
            </Text>
          </TouchableOpacity>

          <Text variant='small' color={theme.colors.text.tertiary} style={styles.termsText}>
            By clicking &apos;Sign up&apos; I agree to PayTruMe&apos;s{' '}
            <Text variant='small' color={theme.colors.primary} onPress={handleTermsPress}>
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text variant='small' color={theme.colors.primary} onPress={handlePrivacyPress}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: 32,
  },
  phoneInputContainer: {
    marginBottom: 16,
  },
  phoneLabel: {
    marginBottom: 8,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  phoneInputWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  phoneInput: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  errorText: {
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  signUpButton: {
    width: '100%',
  },
  errorMessage: {
    marginTop: 12,
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    gap: 16,
  },
  loginLink: {
    paddingVertical: 8,
  },
  termsText: {
    textAlign: 'center',
    lineHeight: 20,
  },
});

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../../../components/typography/Text';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { theme } from '../../../theme';
import { NewPasswordFormData, newPasswordSchema } from '../auth.schema';
import { usePasswordReset } from '../usePasswordReset';

export const NewPasswordForm: React.FC = () => {
  const router = useRouter();
  const { email, otp } = (useLocalSearchParams() as any) || {};
  const { resetPassword, isLoadingReset, error } = usePasswordReset();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onBlur',
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data: NewPasswordFormData) => {
    if (email && otp) {
      await resetPassword(email as string, otp as string, data.newPassword);
    }
  };

  const handleSignUp = () => {
    router.push('/(auth)/register');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        <View style={styles.headerContainer}>
          <Text variant='h1' style={styles.title}>
            Reset password
          </Text>
          <Text variant='body' color={theme.colors.text.secondary} style={styles.subtitle}>
            Create a new password to access your account
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name='newPassword'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Input
                label='New password'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='Enter new password'
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
                label='Re-enter new password'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='Re-enter new password'
                secureTextEntry={!confirmVisible}
                error={error?.message}
                touched={isTouched}
                showPasswordToggle
                onPasswordToggle={() => setConfirmVisible(!confirmVisible)}
                isPasswordVisible={confirmVisible}
              />
            )}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title={isLoadingReset ? 'Resetting...' : 'Log in'} onPress={handleSubmit(onSubmit)} style={styles.loginButton} disabled={!isValid || isLoadingReset} loading={isLoadingReset} />
          {error && (
            <Text variant='small' color={theme.colors.state.error} style={styles.errorMessage}>
              {error}
            </Text>
          )}
        </View>

        <View style={styles.footerContainer}>
          <Text variant='body' color={theme.colors.text.secondary}>
            I don’t have an account.{' '}
            <Text variant='body' color={theme.colors.primary} onPress={handleSignUp} style={styles.signupText}>
              Sign up
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
  buttonContainer: {
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
  },
  errorMessage: {
    marginTop: 12,
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
  },
  signupText: {
    textDecorationLine: 'underline',
  },
});

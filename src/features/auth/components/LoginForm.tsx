import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/typography/Text';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { theme } from '../../../theme';
import { useLogin } from '../useLogin';

// no props needed for LoginForm

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { form, onSubmit, isLoading, error } = useLogin();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form;

  const handleRegisterPress = () => {
    router.push('/(auth)/register');
  };

  const handleForgotPasswordPress = () => {
    router.push('/(auth)/forgot-password');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        <View style={styles.headerContainer}>
          <Text variant='h1' style={styles.title}>
            Welcome Back
          </Text>
          <Text variant='body' color={theme.colors.text.secondary} style={styles.subtitle}>
            Enter your details to log into your account
          </Text>
        </View>

        <View style={styles.formContainer}>
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
            name='password'
            render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
              <Input
                label='Password'
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder='Enter your password'
                secureTextEntry={!passwordVisible}
                error={error?.message}
                touched={isTouched}
                showPasswordToggle
                onPasswordToggle={() => setPasswordVisible(!passwordVisible)}
                isPasswordVisible={passwordVisible}
              />
            )}
          />

          <TouchableOpacity onPress={handleForgotPasswordPress} style={styles.forgotPasswordLink}>
            <Text variant='small' color={theme.colors.primary}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button title={isLoading ? 'Signing in...' : 'Sign in'} onPress={handleSubmit(onSubmit)} style={styles.signInButton} disabled={!isValid || isLoading} loading={isLoading} />
          {error && (
            <Text variant='small' color={theme.colors.state.error} style={styles.errorMessage}>
              {error}
            </Text>
          )}
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={handleRegisterPress} style={styles.registerLink}>
            <Text variant='body' color={theme.colors.text.secondary}>
              I don&apos;t have an account?{' '}
              <Text variant='body' color={theme.colors.primary} style={styles.signupText}>
                Sign up
              </Text>
            </Text>
          </TouchableOpacity>
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
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    marginTop: -8,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  signInButton: {
    width: '100%',
  },
  errorMessage: {
    marginTop: 12,
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
  },
  registerLink: {
    paddingVertical: 8,
  },
  signupText: {
    textDecorationLine: 'underline',
  },
});

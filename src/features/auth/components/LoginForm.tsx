import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
import { Text } from '../../../components/typography/Text';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { theme } from '../../../theme';

// Define login schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// no props needed for LoginForm

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      // Mock API call - replace with actual login API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // On success, navigate to home
      Alert.alert('Success', 'Logged in successfully!', [{ text: 'OK', onPress: () => router.push('/(home)') }]);
    } catch {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

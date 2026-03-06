import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/typography/Text';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { theme } from '../../../theme';
import { ForgotPasswordFormData, forgotPasswordSchema } from '../auth.schema';
import { usePasswordReset } from '../usePasswordReset';

export const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const { sendEmail, isLoadingEmail } = usePasswordReset();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await sendEmail(data.email);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        <View style={styles.headerContainer}>
          <Text variant='h1' style={styles.title}>
            Forgot password
          </Text>
          <Text variant='body' color={theme.colors.text.secondary} style={styles.subtitle}>
            Enter your email address and we will send you a link to recover your password
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
                placeholder='Enter email address'
                keyboardType='email-address'
                autoCapitalize='none'
                error={error?.message}
                touched={isTouched}
              />
            )}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title={isLoadingEmail ? 'Sending...' : 'Send'} onPress={handleSubmit(onSubmit)} style={styles.sendButton} disabled={!isValid || isLoadingEmail} loading={isLoadingEmail} />
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.backLink}>
            <Text variant='small' color={theme.colors.primary}>
              Back to login
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
  buttonContainer: {
    marginBottom: 24,
  },
  sendButton: {
    width: '100%',
  },
  footerContainer: {
    alignItems: 'center',
  },
  backLink: {
    paddingVertical: 8,
  },
});

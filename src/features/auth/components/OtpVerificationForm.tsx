import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../../components/typography/Text';
import { Button } from '../../../components/ui/Button';
import { OtpInput } from '../../../components/ui/OtpInput';
import { theme } from '../../../theme';
import { OtpFormData, otpSchema } from '../auth.schema';
import { usePasswordReset } from '../usePasswordReset';

export const OtpVerificationForm: React.FC = () => {
  const router = useRouter();
  const { email } = (useLocalSearchParams() as any) || {};
  const { verifyOtp, isLoadingOtp, error, otpTimer, resendOtp } = usePasswordReset();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    mode: 'onChange',
    defaultValues: { otp: '' },
  });

  const onSubmit = async (data: OtpFormData) => {
    if (email) {
      await verifyOtp(email as string, data.otp);
    }
  };

  const handleResend = () => {
    if (email && otpTimer === 0) {
      resendOtp(email as string);
    }
  };

  const handleBack = () => {
    router.push('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        <View style={styles.headerContainer}>
          <Text variant='h1' style={styles.title}>
            Reset password
          </Text>
          <Text variant='body' color={theme.colors.text.secondary} style={styles.subtitle}>
            Enter the 6-digit code sent to your email
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name='otp'
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <OtpInput code={value} setCode={onChange} onComplete={(code) => handleSubmit(onSubmit)()} error={error?.message} isLoading={isLoadingOtp} autoFocus />
            )}
          />
          {error && (
            <Text variant='small' color={theme.colors.state.error} style={styles.errorText}>
              {error}
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button title={isLoadingOtp ? 'Verifying...' : 'Reset password'} onPress={handleSubmit(onSubmit)} style={styles.resetButton} disabled={!isValid || isLoadingOtp} loading={isLoadingOtp} />
        </View>

        <View style={styles.resendContainer}>
          {otpTimer > 0 ? (
            <Text variant='small' color={theme.colors.text.secondary}>
              Resend code in {otpTimer}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text variant='small' color={theme.colors.primary}>
                Resend code
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backLink}>
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
    marginBottom: 24,
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 24,
    width: '100%',
  },
  resetButton: {
    width: '100%',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  errorText: {
    marginTop: 8,
  },
  footerContainer: {
    alignItems: 'center',
  },
  backLink: {
    paddingVertical: 8,
  },
});

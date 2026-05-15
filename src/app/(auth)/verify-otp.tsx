import React from 'react';
import { Screen } from '../../components/ui/Screen';
import { OtpVerificationForm } from '../../features/auth/components/OtpVerificationForm';

export default function VerifyOtpScreen() {
  return (
    <Screen>
      <OtpVerificationForm />
    </Screen>
  );
}

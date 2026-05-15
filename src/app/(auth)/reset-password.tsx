import React from 'react';
import { Screen } from '../../components/ui/Screen';
import { OtpVerificationForm } from '../../features/auth/components/OtpVerificationForm';

// This screen is provided for the folder structure but currently mirrors the OTP verification
// step. Depending on routing needs it can be adjusted later.
export default function ResetPasswordScreen() {
  return (
    <Screen>
      <OtpVerificationForm />
    </Screen>
  );
}

import React from 'react';
import { Screen } from '../../components/ui/Screen';
import { RegistrationForm } from '../../features/auth/components/RegistrationForm';

export default function RegisterScreen() {
  return (
    <Screen>
      <RegistrationForm />
    </Screen>
  );
}

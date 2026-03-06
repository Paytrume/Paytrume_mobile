import React from 'react';
import { Screen } from '../../components/ui/Screen';
import { NewPasswordForm } from '../../features/auth/components/NewPasswordForm';

export default function CreateNewPasswordScreen() {
  return (
    <Screen>
      <NewPasswordForm />
    </Screen>
  );
}

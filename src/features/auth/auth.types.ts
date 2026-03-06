export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export interface UseRegistrationReturn {
  form: any; // React Hook Form instance
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

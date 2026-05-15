import { useAuthStore } from '../store/auth.store';

interface SellerSignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  mobile: string;
}

export const useSellerSignup = () => {
  const { signupSeller, loading, error, token, clearError } = useAuthStore();

  const signup = async (data: SellerSignupData) => {
    clearError();
    await signupSeller(data);
  };

  const isSuccessful = token !== null && !loading;

  return {
    signup,
    loading,
    error,
    isSuccessful,
    token,
    clearError,
  };
};

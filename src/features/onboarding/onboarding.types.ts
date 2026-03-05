export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
}

export interface OnboardingScreenProps {
  onLoginPress: () => void;
  onGetStartedPress: () => void;
}

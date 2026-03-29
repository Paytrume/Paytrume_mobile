export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  isVerified: boolean;
  kycStatus: 'verified' | 'pending' | 'not_started';
  businessProfile?: {
    name: string;
    description: string;
    category: string;
  };
  address?: {
    country: string;
    streetAddress: string;
    state: string;
    city: string;
    postalCode: string;
  };
}

export interface Country {
  name: string;
  code: string;
}

export interface State {
  name: string;
  code: string;
  countryCode: string;
}

export interface City {
  name: string;
  code: string;
  stateCode: string;
}

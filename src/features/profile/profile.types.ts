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

export type DocumentType = 'national_id' | 'voters_card' | 'drivers_license';

export interface DocumentTypeOption {
  id: DocumentType;
  label: string;
  icon?: string;
}

export interface VerificationDocument {
  documentType: DocumentType | null;
  frontImage: string | null;
  backImage: string | null;
  proofOfAddress: string | null;
}

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { id: 'national_id', label: 'National ID Card' },
  { id: 'voters_card', label: "Voter's Card" },
  { id: 'drivers_license', label: "Driver's Licence" },
];

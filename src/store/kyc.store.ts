// src/store/kyc.store.ts
import { create } from 'zustand';
import { getKycDocuments, getKycStatus, submitKycDocuments, updateKycDocuments } from '../services/api';

export interface KycState {
  status: string | null;
  documentType: string | null;
  submittedAt: string | null;
  rejectionReason: string | null;
  isLoading: boolean;
  error: string | null;
  hasSubmitted: boolean;
  frontImageUrl: string | null;
  backImageUrl: string | null;
  proofOfAddressUrl: string | null;

  submitDocuments: (payload: { document_type: string; front_image_url: string; back_image_url: string; proof_of_address_url: string }) => Promise<void>;
  updateDocuments: (payload: { document_type: string; front_image_url: string; back_image_url: string; proof_of_address_url: string }) => Promise<void>;
  fetchKycStatus: () => Promise<void>;
  fetchKycDocuments: () => Promise<void>;
  clearError: () => void;
  resetKyc: () => void;
}

export const useKycStore = create<KycState>((set, get) => ({
  status: null,
  documentType: null,
  submittedAt: null,
  rejectionReason: null,
  isLoading: false,
  error: null,
  hasSubmitted: false,
  frontImageUrl: null,
  backImageUrl: null,
  proofOfAddressUrl: null,

  submitDocuments: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await submitKycDocuments(payload);
      if (response.success) {
        set({
          status: response.data.status,
          hasSubmitted: true,
          isLoading: false,
        });
      } else {
        set({ error: response.message || 'Failed to submit documents', isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit documents';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateDocuments: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateKycDocuments(payload);
      if (response.success) {
        set({
          status: response.data.status,
          documentType: response.data.document_type,
          frontImageUrl: response.data.front_image_url,
          backImageUrl: response.data.back_image_url,
          proofOfAddressUrl: response.data.proof_of_address_url,
          isLoading: false,
        });
      } else {
        set({ error: response.message || 'Failed to update documents', isLoading: false });
      }
    } catch (error: any) {
      // Handle different error structures
      let errorMessage = 'Failed to update documents';

      // Check if error has response data from axios
      if (error.response?.data) {
        errorMessage = error.response.data.message || errorMessage;
      }
      // Check if error is the direct message object
      else if (error.message) {
        errorMessage = error.message;
      }
      // Check if error.data exists (from your log)
      else if (error.data?.message) {
        errorMessage = error.data.message;
      }

      console.log(errorMessage, 'Error message');
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchKycStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getKycStatus();
      if (response.success) {
        set({
          status: response.data.status,
          hasSubmitted: response.data.has_submitted,
          submittedAt: response.data.submitted_at,
          rejectionReason: response.data.rejection_reason,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch KYC status';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchKycDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getKycDocuments();
      if (response.success) {
        set({
          documentType: response.data.document_type,
          status: response.data.status,
          frontImageUrl: response.data.front_image_url,
          backImageUrl: response.data.back_image_url,
          proofOfAddressUrl: response.data.proof_of_address_url,
          rejectionReason: response.data.rejection_reason,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch KYC documents';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  resetKyc: () => {
    set({
      status: null,
      documentType: null,
      submittedAt: null,
      rejectionReason: null,
      isLoading: false,
      error: null,
      hasSubmitted: false,
    });
  },
}));

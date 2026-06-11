import axios from 'axios';
import { removeStorageItems } from '../utils/storage';
import { setupApiLogger } from './logger';

const BASE_URL = 'https://paytrume-backend.onrender.com';
// const BASE_URL = 'https://t2sg84b0-3005.uks1.devtunnels.ms';
const TOKEN_KEY = 'paytrume.auth_token';
const USER_KEY = 'paytrume.auth_user';
const PROFILE_KEY = 'paytrume.auth_profile';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Setup API logger interceptors
setupApiLogger(api);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('API error:', error);
    if (error.response?.status === 401) {
      // Token expired or invalid
      await removeStorageItems([TOKEN_KEY, USER_KEY, PROFILE_KEY]);
      // Lazy load auth store to avoid circular dependency
      const { useAuthStore } = await import('@/store/auth.store');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

// Seller Signup API
export const createSellerAccount = async (userData: { first_name: string; last_name: string; email: string; password: string; mobile: string }) => {
  try {
    const response = await api.post('/seller/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Seller Login API
export const loginSeller = async (credentials: { email: string; password: string; trusted?: boolean }) => {
  try {
    const response = await api.post('/seller/login', credentials);
    return response.data;
  } catch (error) {
    console.log('Login API error:', error);
    throw error;
  }
};

// Get Seller Profile API
export const getSellerProfile = async () => {
  try {
    const response = await api.get('/seller/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Forgot Password - Generate OTP
export const forgotPasswordGenerateOtp = async (email: string) => {
  try {
    const response = await api.post('/seller/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Forgot Password - Verify OTP and Reset Password
export const forgotPasswordResetWithOtp = async (email: string, otp: string, password: string) => {
  try {
    const response = await api.post('/seller/forgot-password/otp', { email, otp, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Seller Profile API
export const updateSellerProfile = async (updateData: { first_name?: string; last_name?: string; mobile?: string; account_number?: string; account_name?: string; avatar?: string; address?: any }) => {
  try {
    const response = await api.put('/seller/profile', updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Seller Products API
export const getSellerProducts = async (page: number = 0) => {
  try {
    const response = await api.get('/products/seller', { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Buyer Products API
export const getBuyerProducts = async (page: number = 0) => {
  try {
    const response = await api.get('/products/buyer', { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create Product API
export const createProduct = async (productData: {
  product_name: string;
  product_description: string;
  product_price: string;
  buyer_email: string;
  buyer_phone: string;
  type: string;
  product_images?: string;
  payment_type?: string;
  payment_category?: string;
  percent_rate?: number;
}) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Single Products API
export const getOneProduct = async (id: string) => {
  try {
    const response = await api.get(`/products/single/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Clone Product API
export const cloneProduct = async (id: string, productData: any) => {
  try {
    const response = await api.post(`/products/${id}/clone`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search Products API
export const searchProducts = async (keyword: string, page: number = 0) => {
  try {
    const response = await api.get(`/products/search?name=${keyword}&page=${page}&per_page=10`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Filter Products API
export const filterProducts = async (url: string) => {
  try {
    const response = await api.get(`/products/search?${url}&page=0&per_page=10`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Edit/Update Product API
export const updateProduct = async (
  id: string,
  productData: {
    product_name?: string;
    product_images?: string;
    product_description?: string;
    product_price?: string;
  },
) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Product API
export const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Request for Service Completion (Payout)
export const requestServiceCompletion = async (id: string) => {
  try {
    const response = await api.get(`/products/request_service/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Complete Service Stage (Approve Payout)
export const completeServiceStage = async (id: string, payload: any) => {
  try {
    const response = await api.put(`/products/service/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Request for Refund
export const requestRefund = async (id: string, payload: any) => {
  try {
    const response = await api.post(`/products/request_refund/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all customers
export const getCustomers = async () => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search customers by email
export const searchCustomersByEmail = async (email: string) => {
  try {
    const response = await api.get(`/customers/search?customer_email=${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get customer transactions by email
export const getCustomerTransactions = async (email: string) => {
  try {
    const response = await api.get(`/customers/${email}/transactions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get customer purchase count/transactions summary
export const getCustomerPurchaseCount = async (email: string) => {
  try {
    const response = await api.get(`/customers/${email}/purchase-count`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get customer notifications
export const getUserNotifications = async () => {
  try {
    const response = await api.get('/customers/notifications');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await api.put(`/customers/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.put('/customers/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNigerianBanks = async () => {
  try {
    const response = await api.get('/misc/banks');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Payout Destinations
export const getPayoutDestinationsAPI = async () => {
  try {
    const response = await api.get('/misc/seller/payouts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add Payout Destination
export const addPayoutDestinationAPI = async (payload: { bank_code: string; acct_num: string; acct_name?: string }) => {
  try {
    const response = await api.post('/misc/seller/payouts/bank/add', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Payout Destination
export const deletePayoutDestinationAPI = async (id: string) => {
  try {
    const response = await api.delete(`/misc/seller/payouts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Resolve Account Number
export const resolveAccountAPI = async (bankCode: string, accountNumber: string) => {
  try {
    const response = await api.get(`/misc/account/resolve?bank_code=${bankCode}&acct_num=${accountNumber}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Seller Balance
export const getSellerBalanceAPI = async () => {
  try {
    const response = await api.get('/misc/seller/balance');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Seller Ledger
export const getSellerLedgerAPI = async (optionKey?: string, optionValue?: string) => {
  try {
    let url = '/misc/seller/ledger';
    if (optionKey && optionValue) {
      url += `?${optionKey}=${optionValue}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Request Payout
export const requestPayoutAPI = async (payload: { amount: number; destination_id: string }) => {
  try {
    const response = await api.post('/misc/seller/balance/payout', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Request 2FA Setup
export const request2FAAAPI = async () => {
  try {
    const response = await api.get('/misc/seller/setUp2FA');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Activity Logs
export const getActivityLogsAPI = async () => {
  try {
    const response = await api.get('/misc/seller/logs');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Raise a Dispute
export const raiseDisputeAPI = async (payload: { product_id: string; reason: string; amount?: number }) => {
  try {
    const response = await api.post('/misc/disputes', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All Disputes
export const getAllDisputesAPI = async () => {
  try {
    const response = await api.get('/misc/disputes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Dispute
export const deleteDisputeAPI = async (id: string) => {
  try {
    const response = await api.delete(`/misc/disputes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get User Balances
export const getUserBalances = async () => {
  try {
    const response = await api.get(`/customers/balances`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Seller Transactions
export const getSellerTransactions = async () => {
  try {
    const response = await api.get('/transactions/seller');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Submit KYC Documents
export const submitKycDocuments = async (payload: { document_type: string; front_image_url: string; back_image_url: string; proof_of_address_url: string }) => {
  try {
    const response = await api.post('/kyc/submit', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get KYC Status
export const getKycStatus = async () => {
  try {
    const response = await api.get('/kyc/status');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get KYC Documents
export const getKycDocuments = async () => {
  try {
    const response = await api.get('/kyc/documents');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateKycDocuments = async (payload: { document_type: string; front_image_url: string; back_image_url: string; proof_of_address_url: string }) => {
  try {
    const response = await api.put('/kyc/update', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerDevice = async (payload: { expoPushToken: string }) => {
  try {
    const response = await api.post('/notification/register-device', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNotifications = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnreadNotifications = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/notifications/unread?page=${page}&limit=${limit}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markNotificationRead = async (id: string) => {
  try {
    const response = await api.patch(`/notifications/${id}/read`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const shipProduct = async (id: string) => {
  try {
    const response = await api.put(`/shipped/${id}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmProduct = async (id: string, payload: { confirmation_code : string}) => {
  try {
    const response = await api.put(`/confirmation/${id}`, payload);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendPaymentLink = async (id: string) => {
  try {
    const response = await api.post(`/products/${id}/resend-payment-email`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

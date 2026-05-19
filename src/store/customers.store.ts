// src/store/customers.store.ts
import { ArrowUpRight, Wallet } from 'lucide-react-native';
import React from 'react';
import { create } from 'zustand';
import {
  getCustomerPurchaseCount,
  getCustomers,
  getCustomerTransactions,
  getUserBalances,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  searchCustomersByEmail,
} from '../services/api';
import { theme } from '../theme';
import { BalanceCard, Customer, CustomersState, CustomerTransaction, CustomerTransactionSummary, Notification, UserBalanceData } from '../types/customer.types';

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  customerTransactions: [],
  customerTransactionSummary: null,
  notifications: [],
  isLoading: false,
  error: null,
  unreadCount: 0,
  balanceCards: [],
  userBalanceData: null,

  // Fetch all customers
  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCustomers();

      // Extract customer data from response (matching your frontend pattern)
      let customers: Customer[] = [];
      if (response.success && response.data) {
        customers = response.data.map((item: any) => item.customer);
      } else if (response.data && !response.success) {
        customers = response.data.map((item: any) => item.customer);
      } else if (Array.isArray(response.data)) {
        customers = response.data.map((item: any) => item.customer || item);
      }

      set({ customers, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customers';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Search customers by email
  searchCustomers: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await searchCustomersByEmail(email);

      let customers: Customer[] = [];
      if (response.success && response.data) {
        customers = response.data.map((item: any) => item.customer);
      } else if (response.data && !response.success) {
        customers = response.data.map((item: any) => item.customer);
      } else if (Array.isArray(response.data)) {
        customers = response.data.map((item: any) => item.customer || item);
      }

      set({ customers, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search customers';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Fetch customer transactions by email
  fetchCustomerTransactions: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const [transactionsResponse, purchaseCountResponse] = await Promise.all([getCustomerTransactions(email), getCustomerPurchaseCount(email)]);

      let transactions: CustomerTransaction[] = [];
      if (transactionsResponse.success && transactionsResponse.data) {
        transactions = transactionsResponse.data;
      } else if (Array.isArray(transactionsResponse.data)) {
        transactions = transactionsResponse.data;
      }

      let summary: CustomerTransactionSummary = {
        purchases_count: 0,
      };

      if (purchaseCountResponse.success && purchaseCountResponse.data) {
        summary = {
          ...summary,
          ...purchaseCountResponse.data,
          purchases_count: purchaseCountResponse.data,
        };
      } else if (typeof purchaseCountResponse.data === 'number') {
        summary.purchases_count = purchaseCountResponse.data;
      }

      set({
        customerTransactions: transactions,
        customerTransactionSummary: summary,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customer transactions';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Fetch customer transactions summary only
  fetchCustomerTransactionsSummary: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getCustomerPurchaseCount(email);

      let summary: CustomerTransactionSummary = {
        purchases_count: 0,
      };

      if (response.success && response.data) {
        if (response.data.transactions) {
          summary = response.data.transactions;
        } else {
          summary = {
            ...summary,
            ...response.data,
            purchases_count: response.data,
          };
        }
      } else if (typeof response.data === 'number') {
        summary.purchases_count = response.data;
      }

      set({ customerTransactionSummary: summary, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transaction summary';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Fetch user notifications
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getUserNotifications();

      let notifications: Notification[] = [];
      let unreadCount = 0;

      if (response.success && response.data) {
        notifications = response.data;
        unreadCount = notifications.filter((n) => !n.isRead).length;
      } else if (Array.isArray(response.data)) {
        notifications = response.data;
        unreadCount = notifications.filter((n) => !n.isRead).length;
      }

      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    try {
      const response = await markNotificationAsRead(notificationId);

      if (response.success) {
        // Update local state
        const { notifications } = get();
        const updatedNotifications = notifications.map((notification) => (notification._id === notificationId ? { ...notification, isRead: true } : notification));

        const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;

        set({
          notifications: updatedNotifications,
          unreadCount,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await markAllNotificationsAsRead();

      if (response.success) {
        // Update local state
        const { notifications } = get();
        const updatedNotifications = notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));

        set({
          notifications: updatedNotifications,
          unreadCount: 0,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark all notifications as read';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Get User Balances
  userBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getUserBalances();

      if (response.success && response.data) {
        const { balance, available_balance, revenue, total_payout, total_withdrawn, currency } = response.data;

        // Create balance cards in the order: balance, available_balance, total_payout, revenue, total_withdrawn
        const balanceCards: BalanceCard[] = [
          {
            id: '1',
            title: 'Escrow Balance',
            amount: `${currency || 'NGN'} ${(balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtitle: 'Securely held in escrow',
            icon: React.createElement(Wallet, { size: 24, color: theme.colors.primary }),
            color: theme.colors.primary,
          },
          {
            id: '2',
            title: 'Available to Withdraw',
            amount: `${currency || 'NGN'} ${(available_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtitle: 'Ready for withdrawal →',
            icon: React.createElement(Wallet, { size: 24, color: '#10B981' }),
            color: '#10B981',
          },
          {
            id: '3',
            title: 'Total Payout',
            amount: `${currency || 'NGN'} ${(total_payout || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtitle: 'Total withdrawn value',
            icon: React.createElement(ArrowUpRight, { size: 24, color: '#F59E0B' }),
            color: '#F59E0B',
          },
          {
            id: '4',
            title: 'Net Revenue',
            amount: `${currency || 'NGN'} ${(revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            subtitle: 'After fees',
            icon: React.createElement(Wallet, { size: 24, color: '#8B5CF6' }),
            color: '#8B5CF6',
          },
          {
            id: '5',
            title: 'Withdrawal Count',
            amount: `${(total_withdrawn || 0).toLocaleString()}`,
            subtitle: 'Number of withdrawals',
            icon: React.createElement(ArrowUpRight, { size: 24, color: '#3B82F6' }),
            color: '#3B82F6',
          },
        ];

        const userBalanceData: UserBalanceData = {
          balance: balance || 0,
          totalWithdrawn: total_withdrawn || 0,
          totalReceived: revenue || 0,
          pendingWithdrawals: 0,
          availableBalance: available_balance || 0,
          currency: currency || 'NGN',
        };

        set({
          balanceCards,
          userBalanceData,
          isLoading: false,
        });
      } else {
        set({
          error: response.message || 'Failed to get user balances',
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user balances';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset customers state
  resetCustomers: () => {
    set({
      customers: [],
      selectedCustomer: null,
      customerTransactions: [],
      customerTransactionSummary: null,
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
    });
  },
}));

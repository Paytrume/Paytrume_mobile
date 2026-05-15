import { useCustomersStore } from '../store/customers.store';

export const useCustomers = () => {
  const {
    customers,
    customerTransactions,
    customerTransactionSummary,
    notifications,
    isLoading,
    error,
    fetchCustomers,
    searchCustomers,
    fetchCustomerTransactions,
    fetchCustomerTransactionsSummary,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearError,
  } = useCustomersStore();

  return {
    customers,
    customerTransactions,
    customerTransactionSummary,
    notifications,
    isLoading,
    error,
    fetchCustomers,
    searchCustomers,
    fetchCustomerTransactions,
    fetchCustomerTransactionsSummary,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearError,
  };
};

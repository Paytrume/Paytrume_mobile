import { useEffect } from 'react';
import { useTransactionsStore } from '../store/transactions.store';

export const useTransactions = () => {
  const { transactions, selectedTransaction, isLoading, error, fetchTransactions, selectTransaction, clearError } = useTransactionsStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    selectedTransaction,
    isLoading,
    error,
    fetchTransactions,
    selectTransaction,
    clearError,
  };
};

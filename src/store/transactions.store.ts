import { create } from 'zustand';
import { getSellerTransactions } from '../services/api';
import { Transaction, TransactionDetail, TransactionsState } from '../types/transaction.types';

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  error: null,

  // Fetch all transactions
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getSellerTransactions();

      let transactions: Transaction[] = [];
      if (response.success && response.data) {
        transactions = response.data;
      } else if (Array.isArray(response.data)) {
        transactions = response.data;
      }

      set({ transactions, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Select a transaction to view details
  selectTransaction: (transaction: Transaction) => {
    const detail: TransactionDetail = {
      ...transaction,
      details: {
        transactionId: transaction._id,
        reference: transaction.reference_id,
        title: transaction.product_name,
        description: transaction.product_description,
        timestamp: new Date(transaction.createdAt).toLocaleString(),
      },
    };
    set({ selectedTransaction: detail });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

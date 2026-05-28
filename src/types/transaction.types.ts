export interface Transaction {
  _id: string;
  type: 'payment_received' | 'withdrawal' | 'refund' | 'dispute' | 'payout';
  product_name: string;
  product_description: string;
  amount: number;
  currency: string;
  status: 'pending' | 'payment-in-escrow' | 'shipped' | 'cancel' | 'complete' | 'funds-released';
  direction: 'credit' | 'debit';
  createdAt: string;
  product_id?: Record<string, string>;
  customer_email?: string;
  customer_name?: string;
  receipt_url?: string;
  reference_id?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  escrow_ref?: {
    authorization_url?: string;
    access_code?: string;
    reference?: string;
  };
  buyer_id: string;
  seller_id: string;
  verification_code?: string;
  transaction_success_id?: number;
  seller_rating?: number;
  balance_before?: number;
  balance_after?: number;
  deposit_log_id?: string;
  withdrawal_log_id?: string;
  refund_log_id?: string;
  payout_log_id?: string;
  dispute_log_id?: string;
}

export interface TransactionDetail extends Transaction {
  details?: {
    [key: string]: any;
  };
  metadata?: {
    [key: string]: any;
  };
}

export interface TransactionsState {
  transactions: Transaction[];
  selectedTransaction: TransactionDetail | null;
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  selectTransaction: (transaction: Transaction) => void;
  clearError: () => void;
}

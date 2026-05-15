export interface Customer {
  _id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  mobile?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CustomerTransaction {
  _id: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'purchase' | 'refund' | 'payout';
  product_name?: string;
  product_id?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CustomerTransactionSummary {
  total_purchases?: number;
  total_spent?: string;
  average_purchase?: string;
  last_purchase_date?: string;
  purchases_count?: number;
  [key: string]: any;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt?: string;
  [key: string]: any;
}

export interface BalanceCard {
  id: string;
  title: string;
  amount: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

export interface UserBalanceData {
  balance: number;
  totalWithdrawn: number;
  totalReceived: number;
  pendingWithdrawals: number;
  availableBalance: number;
  currency: string;
}

export interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  customerTransactions: CustomerTransaction[];
  customerTransactionSummary: CustomerTransactionSummary | null;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  unreadCount: number; // Add this for convenience

  // Actions
  fetchCustomers: () => Promise<void>;
  searchCustomers: (email: string) => Promise<void>;
  fetchCustomerTransactions: (email: string) => Promise<void>;
  fetchCustomerTransactionsSummary: (email: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
  resetCustomers: () => void;
  balanceCards: BalanceCard[];
  userBalanceData: UserBalanceData | null;
  userBalance: () => Promise<void>;
}

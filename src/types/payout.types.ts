export interface Bank {
  code: string;
  name: string;
  slug: string;
  [key: string]: any;
}

export interface PayoutDestination {
  _id: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  created_at?: string;
  [key: string]: any;
}

export interface AccountResolution {
  account_number: string;
  account_name: string;
  bank_code: string;
  [key: string]: any;
}

export interface SellerBalance {
  balance: number;
  available_balance: number;
  ledger_balance: number;
  currency: string;
  [key: string]: any;
}

export interface LedgerEntry {
  _id: string;
  amount: number;
  type: 'credit' | 'debit';
  source: 'payout' | 'payment' | 'refund' | 'fee';
  description: string;
  created_at: string;
  [key: string]: any;
}

export interface PayoutState {
  nigerianBanks: Bank[];
  payoutDestinations: PayoutDestination[];
  resolvedAccount: AccountResolution | null;
  balance: SellerBalance | null;
  ledger: LedgerEntry[];
  isLoading: boolean;
  error: string | null;

  // Actions
  getBanks: () => Promise<void>;
  getPayoutDestinations: () => Promise<void>;
  addPayoutDestination: (payload: any) => Promise<void>;
  deletePayoutDestination: (id: string) => Promise<void>;
  resolveAccount: (bankCode: string, accountNumber: string) => Promise<void>;
  getSellerBalance: () => Promise<void>;
  getSellerLedger: (optionKey?: string, optionValue?: string) => Promise<void>;
  requestPayout: (payload: any) => Promise<void>;
  request2FA: () => Promise<any>;
  clearError: () => void;
  resetPayout: () => void;
}

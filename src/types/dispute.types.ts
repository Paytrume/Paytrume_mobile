export interface Dispute {
  _id: string;
  product_id: string;
  product_name: string;
  amount: number;
  reason: string;
  status: 'open' | 'resolved' | 'closed' | 'pending';
  created_at: string;
  resolved_at?: string;
  [key: string]: any;
}

export interface DisputeState {
  disputes: Dispute[];
  isLoading: boolean;
  error: string | null;

  // Actions
  raiseDispute: (payload: any) => Promise<void>;
  getAllDisputes: () => Promise<void>;
  deleteDispute: (id: string) => Promise<void>;
  clearError: () => void;
  resetDisputes: () => void;
}

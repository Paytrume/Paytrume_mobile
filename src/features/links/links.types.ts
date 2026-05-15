export type LinkType = 'goods' | 'services';
export type PaymentType = 'one-time' | 'recurring';
export type RecurringRate = '10' | '20' | '25' | '50' | '100';
export type RecurringCategory = 'weekly' | 'bi-weekly' | 'monthly' | 'yearly' | 'custom';
export type LinkStatus = 'active' | 'draft' | 'expired';

export interface CreateLinkFormData {
  // Common fields
  type: LinkType;
  name: string;
  cost: string;
  description: string;
  customerEmail: string;
  customerPhone: string;
  coverPhoto?: string;

  // Service-specific fields
  paymentType?: PaymentType;
  recurringRate?: RecurringRate;
  recurringCategory?: RecurringCategory;
}

export interface RecurringOption {
  label: string;
  value: RecurringRate | RecurringCategory;
}

export interface LinkItem {
  id: string;
  title: string;
  amount: string;
  link: string;
  status: LinkStatus;
  createdAt: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
}

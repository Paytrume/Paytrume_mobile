import { Product } from '@/store/products.store';

export const truncateString = (str: string, maxLength: number): string => {
  return str?.length > maxLength ? str?.slice(0, maxLength) + '...' : str;
};

export const getStatus = (item: Product): string => {
  console.log(item, 'item.customer_paid');
  if (item.customer_paid && item.customer_paid.status) {
    console.log(item, item.customer_paid.status, 'item.customer_paid');
    if (item.delivered && item.delivered.status) {
      if (item.confirmed_recieved && item.confirmed_recieved.status) {
        if (item.funds_released &&item.funds_released.status) {
          return 'completed';
        } else {
          return 'in_escrow';
        }
      } else {
        return 'Awaiting Confirmation';
      }
    } else {
      console.log('Awaiting Shippment');
      return 'Awaiting Shippment';
    }
  } else {
    return 'awaiting_pay';
  }
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime2 = (dateString: string) => {
  const date = new Date(dateString);

  return {
    date: date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

import { z } from 'zod';

export const createLinkSchema = z
  .object({
    type: z.enum(['product', 'service']),
    name: z.string().min(1, 'Name is required'),
    cost: z.string().min(1, 'Cost is required'),
    description: z.string().optional(),
    customerEmail: z.string().email('Invalid email address'),
    customerPhone: z.string().min(10, 'Phone number is required'),
    coverPhoto: z.string().optional(),

    // Service-specific fields (optional based on type)
    paymentType: z.enum(['one-time', 'recurring']).optional(),
    recurringRate: z.enum(['10', '20', '25', '50', '100']).optional(),
    recurringCategory: z.string().optional(),
  })
  .refine(
    (data) => {
      // If service and recurring, require recurringRate
      if (data.type === 'service' && data.paymentType === 'recurring') {
        return !!data.recurringRate;
      }
      return true;
    },
    {
      message: 'Please select a recurring rate',
      path: ['recurringRate'],
    },
  );

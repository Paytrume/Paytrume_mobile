import { z } from 'zod';

export const createLinkSchema = z
  .object({
    type: z.enum(['goods', 'services']),
    name: z.string().min(1, 'Name is required'),
    cost: z.string().min(1, 'Cost is required'),
    description: z.string().optional(),
    customerEmail: z.string().email('Invalid email address'),
    customerPhone: z.string().min(10, 'Phone number is required'),
    coverPhoto: z.string().min(1, 'Cover photo is required'),

    // Service-specific fields (optional based on type)
    paymentType: z.enum(['one-time', 'recurring']).optional(),
    recurringRate: z.enum(['10', '20', '25', '50', '100']).optional(),
    recurringCategory: z.string().optional(),
  })
  .refine(
    (data) => {
      // If service and recurring, require recurringRate and recurringCategory
      if (data.type === 'services' && data.paymentType === 'recurring') {
        return !!data.recurringRate && !!data.recurringCategory;
      }
      return true;
    },
    {
      message: 'Please select a recurring rate and category',
      path: ['recurringRate'],
    },
  );

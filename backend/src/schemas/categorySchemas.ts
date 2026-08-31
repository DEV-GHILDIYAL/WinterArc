import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required').max(50),
    icon: z.string().default('Flame'),
    type: z.enum(['boolean', 'numeric']),
    targetValue: z.number().min(1).optional(),
    unit: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    icon: z.string().optional(),
    type: z.enum(['boolean', 'numeric']).optional(),
    targetValue: z.number().min(1).optional(),
    unit: z.string().optional(),
    active: z.boolean().optional(),
    order: z.number().optional(),
  }),
});

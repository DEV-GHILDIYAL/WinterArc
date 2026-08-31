import { z } from 'zod';

export const saveLogSchema = z.object({
  params: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  }),
  body: z.object({
    entries: z.array(
      z.object({
        categoryId: z.string(),
        value: z.number().min(0),
        completed: z.boolean(),
      })
    ),
    note: z.string().max(1000).optional(),
  }),
});

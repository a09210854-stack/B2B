import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['buyer', 'seller']),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createProductSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  images: z.array(z.string()).optional(),
  hsCode: z.string().optional(),
  moq: z.number().int().positive().optional(),
  priceUsd: z.number().positive(),
  currencyDisplay: z.string().default('USD'),
  incoterm: z.enum(['EXW','FOB','CIF','DAP','DDP']),
  leadTimeDays: z.number().int().optional(),
  category: z.string().optional(),
  companyId: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15).trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['farmer', 'buyer'], {
    errorMap: () => ({ message: 'Role must be either farmer or buyer' }),
  }),
  location: z.string().min(2, 'Location is required').trim(),
  farmDetails: z
    .object({
      cropsGrown: z.array(z.string()).optional(),
      totalAcres: z.number().positive().optional(),
    })
    .optional(),
  businessName: z.string().min(2).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

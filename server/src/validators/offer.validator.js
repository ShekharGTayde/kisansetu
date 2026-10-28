import { z } from 'zod'

export const offerSchema = z.object({
  proposedPrice: z.number().int().positive(),
  quantity: z.number().positive(),
  deliveryDate: z.coerce.date().refine((value) => value > new Date(), 'Delivery date must be in the future'),
  note: z.string().trim().optional().default(''),
})

export const counterSchema = z.object({
  price: z.number().int().positive(),
  quantity: z.number().positive(),
  deliveryDate: z.coerce.date().refine((value) => value > new Date(), 'Delivery date must be in the future'),
  message: z.string().trim().optional().default(''),
})

import { z } from 'zod'

const futureOrToday = z.coerce.date().refine((value) => value >= new Date(Date.now() - 86400000), 'Date cannot be in the past')

export const cropListingSchema = z.object({
  crop: z.string().trim().min(2),
  variety: z.string().trim().optional().default(''),
  cropType: z.enum(['available', 'expected']),
  quantity: z.number().positive(),
  unit: z.enum(['kg', 'quintal', 'ton', 'tonne']),
  pricePerUnit: z.number().int().positive(),
  location: z.string().trim().min(2),
  availableFrom: futureOrToday,
  qualityNotes: z.string().trim().optional().default(''),
})

export const purchaseOrderSchema = z.object({
  quantity: z.number().positive(),
  deliveryLocation: z.string().trim().min(2),
  note: z.string().trim().optional().default(''),
})

export const orderStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
})

export const cropStatusSchema = z.object({
  status: z.enum(['open', 'paused']),
})

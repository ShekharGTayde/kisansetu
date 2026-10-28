import { z } from 'zod'

const futureDate = z.coerce.date().refine((value) => value > new Date(), 'Date must be in the future')

export const listingSchema = z.object({
  crop: z.string().trim().min(2),
  variety: z.string().trim().optional().default(''),
  quantity: z.number().positive(),
  unit: z.enum(['quintal', 'kg', 'ton', 'tonne', 'Quintals']),
  qualitySpec: z
    .object({
      grade: z.string().trim().optional(),
      moistureMax: z.string().trim().optional(),
      notes: z.string().trim().optional(),
    })
    .optional(),
  priceTerms: z.object({
    pricePerUnit: z.number().int().positive(),
    minPrice: z.number().int().positive().optional(),
    maxPrice: z.number().int().positive().optional(),
  }),
  deliveryLocation: z.string().trim().min(2),
  deliveryDate: futureDate,
  paymentTerms: z.string().trim().min(2),
  validTill: futureDate.optional(),
})

export const listingUpdateSchema = listingSchema.partial()

export const listingStatusSchema = z.object({
  status: z.enum(['open', 'paused', 'closed']),
})

import { z } from 'zod'

export const PublicCommunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  colour: z.string().nullable(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  stripeAccountId: z.string().nullable(),
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  tiktok: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  userId: z.string().nullable().optional()
})

export type PublicCommunityType = z.infer<typeof PublicCommunitySchema>

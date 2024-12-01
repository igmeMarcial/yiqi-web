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

export const GetCommunitiesParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(12),
  search: z.string().optional()
})

export type PublicCommunityType = z.infer<typeof PublicCommunitySchema>
export type GetCommunitiesParams = z.infer<typeof GetCommunitiesParamsSchema>

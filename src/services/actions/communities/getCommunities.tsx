'use server'

import prisma from '@/lib/prisma'
import {
  PublicCommunitySchema,
  GetCommunitiesParamsSchema,
  type GetCommunitiesParams
} from '@/schemas/communitySchema'

export default async function getCommunities(
  params?: Partial<GetCommunitiesParams>
) {
  // Validate and set default params
  const { page, limit, search } = GetCommunitiesParamsSchema.parse({
    page: params?.page || 1,
    limit: params?.limit || 12,
    search: params?.search
  })

  // Calculate skip for pagination
  const skip = (page - 1) * limit

  // Build where clause
  const where = search
    ? {
        name: {
          contains: search,
          mode: 'insensitive' as const
        },
        deletedAt: null
      }
    : {
        deletedAt: null
      }

  // Get total count for pagination
  const total = await prisma.organization.count({
    where
  })

  // Get communities
  const communities = await prisma.organization.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      name: 'asc'
    }
  })

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit)
  const hasMore = page < totalPages
  const nextPage = hasMore ? page + 1 : null

  return {
    communities: PublicCommunitySchema.array().parse(communities),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore,
      nextPage
    }
  }
}

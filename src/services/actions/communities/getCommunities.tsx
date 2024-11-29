'use server'

import { PublicCommunitySchema } from '@/schemas/communitySchema'
import { organizationService } from '@/services/organizationService'

export default async function getCommunities() {
  const communities = await organizationService.getAll()
  return PublicCommunitySchema.array().parse(communities)
}

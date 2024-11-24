import { organizationService } from '@/services/organizationService'

export const getCommunities = async () => {
  return await organizationService.getAll()
}

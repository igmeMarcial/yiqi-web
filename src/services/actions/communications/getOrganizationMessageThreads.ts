'use server'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import { OrgMessageListItemSchema } from '@/schemas/messagesSchema'

export async function getOrganizationMessageThreads(orgId: string) {
  const currentUser = await getUser()
  if (!currentUser) throw new Error('Unauthorized')

  const isAllowed = await isOrganizerAdmin(orgId, currentUser.id)

  if (!isAllowed) {
    throw new Error('Unauthorized: no access to event or organization')
  }

  const messageThreads = await prisma.messageThread.findMany({
    where: {
      organizationId: orgId
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 100,
    distinct: ['contextUserId'],
    include: {
      contextUser: true,
      messages: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    }
  })

  return messageThreads.map(thread => OrgMessageListItemSchema.parse(thread))
}

'use server'

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import { MessageListSchema } from '@/schemas/messagesSchema'

export async function getUserMessageList(
  userId: string,
  orgId: string,
  cursorId?: string
) {
  const currentUser = await getUser()
  if (!currentUser) throw new Error('Unauthorized')

  const isAllowed = await isOrganizerAdmin(orgId, currentUser.id)
  if (!isAllowed) {
    throw new Error('Unauthorized: no access to event or organization')
  }

  const messageList = await prisma.message.findMany({
    where: {
      OR: [{ senderUserId: userId }, { destinationUserId: userId }],
      messageThread: {
        organizationId: orgId
      }
    },
    take: 20,
    ...(cursorId && {
      cursor: { id: cursorId },
      skip: 1 // Skip the cursor itself
    }),
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      senderUser: {
        select: { id: true, name: true, picture: true }
      },
      destinationUser: {
        select: { id: true, name: true, picture: true }
      },
      messageThread: {
        select: {
          type: true,
          id: true
        }
      }
    }
  })

  return MessageListSchema.parse(messageList)
}

'use server'
// adds the notifications to the notifictions queue for the cron job to handle.
// we do this because we don't want to block the request if the list is large

import { getUser, isOrganizerAdmin } from '@/lib/auth/lucia'
import prisma from '@/lib/prisma'
import {
  SendBaseMessageToUserProps,
  SendBaseMessageToUserPropsSchema
} from '@/services/notifications/sendBaseMessageToUser'
import { NotificationType } from 'prisma/prisma-client'
// and we want to be able to send multiple messages in a row without waiting for the previous one to finish
export async function sendBulkMessagesAction({
  eventId,
  ...props
}: SendBaseMessageToUserProps & {
  eventId?: string
}) {
  const currentUser = await getUser()
  if (!currentUser) throw new Error('Unauthorized')

  const isAllowed = await isOrganizerAdmin(props.orgId, currentUser.id)
  if (!isAllowed) {
    throw new Error('Unauthorized: not allowed to see messages')
  }

  const events = await prisma.event.findMany({
    where: eventId
      ? {
          id: eventId
        }
      : {
          organizationId: props.orgId
        },
    include: {
      registrations: {
        include: {
          user: {
            select: {
              id: true
            }
          }
        }
      }
    }
  })

  const notificationsToSend: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extraData: any
    userId: string
    eventId: string
    organizationId: string
    type: NotificationType
    scheduledFor: Date
  }[] = []

  events.forEach(event => {
    event.registrations.forEach(registration => {
      notificationsToSend.push({
        userId: registration.user.id,
        eventId: event.id,
        organizationId: event.organizationId,
        type: NotificationType.BASE_NOTIFICATION,
        extraData: SendBaseMessageToUserPropsSchema.parse(props),
        scheduledFor: new Date()
      })
    })
  })

  const notifications = await prisma.notification.createMany({
    data: notificationsToSend
  })

  return notifications
}

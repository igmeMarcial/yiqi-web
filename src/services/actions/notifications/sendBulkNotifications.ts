import prisma from '@/lib/prisma'
import { SendBaseMessageToUserPropsSchema } from '@/services/notifications/sendBaseMessageToUser'
import { JobType } from '@prisma/client'

export async function sendBulkNotifications({ orgId }: { orgId: string }) {
  const peopleToSend = await prisma.organizationContact.findMany({
    where: {
      organizationId: orgId
    },
    include: {
      user: true
    }
  })
  const registrations = await prisma.eventRegistration.findMany({
    where: {
      event: {
        organizationId: orgId
      }
    },
    include: {
      user: true
    }
  })

  const dataToTake = [
    ...peopleToSend.map(person => {
      const data = SendBaseMessageToUserPropsSchema.parse(person)

      return {
        userId: person.user.id,
        organizationId: orgId,
        scheduledFor: new Date(),
        type: JobType.SEND_USER_MESSAGE,
        data: data
      }
    }),
    ...registrations.map(person => {
      const data = SendBaseMessageToUserPropsSchema.parse(person)

      return {
        userId: person.user.id,
        organizationId: orgId,
        scheduledFor: new Date(),
        type: JobType.SEND_USER_MESSAGE,
        data: data
      }
    })
  ]

  const notifications = await prisma.queueJob.createMany({
    data: dataToTake
  })

  console.debug(notifications)
  return { sucess: true }
}

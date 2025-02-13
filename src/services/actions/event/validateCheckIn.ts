'use server'

import prisma from '@/lib/prisma'

export const validateCheckIn = async (eventId: string, userId: string) => {
  if (!eventId) return false

  const asd = await prisma.eventRegistration.findFirst({
    where: { AND: [{ eventId, userId }] },
    include: { tickets: true }
  })

  if (!asd) return false
  return asd.tickets.map(_ => !!_.checkedInDate).some(_ => _)
}

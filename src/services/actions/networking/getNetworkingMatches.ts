'use server'

import prisma from '@/lib/prisma'
import { networkingMatchesSchema } from '@/schemas/networkingMatchSchema'

export const getNetworkingMatches = async (registrationId: string) => {
  const matches = await prisma.networkingMatch.findMany({
    where: { registrationId },
    include: { user: { select: { id: true, name: true, picture: true } } }
  })

  return networkingMatchesSchema.parse(matches)
}

export async function getNetworkingMatchesByEventUser(
  _userId: string,
  eventId: string
) {
  const r = await prisma.eventRegistration.findFirstOrThrow({
    where: { userId: _userId, eventId },
    select: { id: true }
  })
  const matches = await prisma.networkingMatch.findMany({
    where: { registrationId: r.id },
    include: { user: { select: { id: true, name: true, picture: true } } }
  })

  return networkingMatchesSchema.parse(matches)
}

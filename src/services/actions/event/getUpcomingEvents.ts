'use server'

import prisma from '@/lib/prisma'
import { PublicEventSchema } from '@/schemas/eventSchema'
import { Prisma } from '@prisma/client'

export async function getUpcomingEvents() {
  const now = new Date()

  const whereClause: Prisma.EventWhereInput = {
    startDate: { gte: now },
    endDate: { gte: now }
  }

  const events = await prisma.event.findMany({
    where: whereClause,
    take: 8,
    include: {
      organization: {
        select: {
          logo: true,
          name: true
        }
      },
      registrations: {
        select: {
          id: true
        }
      }
    },
    orderBy: { startDate: 'asc' }
  })

  return events.map(event =>
    PublicEventSchema.parse({
      ...event,
      registrations: event.registrations.length
    })
  )
}

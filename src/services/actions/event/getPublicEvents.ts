'use server'

import prisma from '@/lib/prisma'
import { PublicEventSchema } from '@/schemas/eventSchema'
import { EventTypes, Prisma } from '@prisma/client'

export async function getPublicEvents(filters: {
  title?: string
  location?: string
  startDate?: string
  endDate?: string
  type?: string
}) {
  const now = new Date()
  const whereClause: Prisma.EventWhereInput = {
    endDate: { gte: now }
  }

  if (filters.title) {
    whereClause.title = { contains: filters.title, mode: 'insensitive' }
  }

  if (filters.location) {
    whereClause.location = { contains: filters.location, mode: 'insensitive' }
  }

  if (filters.startDate && filters.endDate) {
    whereClause.startDate = { gte: new Date(filters.startDate) }
    whereClause.endDate = { lte: new Date(filters.endDate) }
  }

  if (filters.type) {
    whereClause.type = { equals: filters.type as EventTypes }
  }

  const events = await prisma.event.findMany({
    where: whereClause,
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

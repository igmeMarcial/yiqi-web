'use server'

import prisma from '@/lib/prisma'
import { SavedEventSchema } from '@/schemas/eventSchema'
import { subMinutes } from 'date-fns'

export async function getUserOngoingEvent(email?: string) {
  if (!email) return null

  const now = new Date()
  const minutesBefore = subMinutes(now, 20)

  try {
    const eventRegistration = await prisma.eventRegistration.findFirst({
      where: {
        user: {
          email: email.toLowerCase()
        },
        event: {
          OR: [
            {
              // Match events starting in the next 20 minutes
              startDate: { gte: minutesBefore, lte: now }
            },
            {
              // Match ongoing events
              startDate: { lte: now },
              endDate: { gte: now }
            }
          ]
        }
      },
      include: {
        user: true,
        event: true
      }
    })

    return eventRegistration?.event
      ? SavedEventSchema.parse(eventRegistration.event)
      : null
  } catch (error) {
    console.error('Error fetching user event:', error)
    return null
  }
}

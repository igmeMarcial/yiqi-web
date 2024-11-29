'use server'

import prisma from '@/lib/prisma'
import { PublicEventSchema } from '@/schemas/eventSchema'

export async function getEventById(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organization: true,
        registrations: {
          select: {
            id: true
          }
        },
        tickets: true
      }
    })

    if (!event) {
      return null
    }

    return PublicEventSchema.parse({
      ...event,
      registrations: event.registrations.length
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    throw new Error(`Failed to fetch event: ${error}`)
  }
}

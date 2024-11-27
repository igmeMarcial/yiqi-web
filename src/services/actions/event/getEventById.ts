'use server'

import prisma from '@/lib/prisma'
import { PublicEventSchema } from '@/schemas/eventSchema'

export async function getEventById(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      throw new Error(`Failed to fetch event: ${eventId}`)
    }

    return PublicEventSchema.parse(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    throw new Error(`Failed to fetch event: ${error}`)
  }
}

'use server'

import prisma from '@/lib/prisma'
import { PublicEvent, Host } from '@/components/lumalike/template1'

/**
 * Parses a JSON field into a strongly-typed object.
 * @param field - The JSON string field to parse.
 * @returns The parsed object, or `undefined` if parsing fails.
 */
function parseJsonField<T>(field: string | null): T | undefined {
  if (!field) {
    return undefined
  }
  try {
    return JSON.parse(field) as T
  } catch (error) {
    console.error('Error parsing JSON field:', error)
    return undefined
  }
}

export async function getEventById(
  eventId: string
): Promise<PublicEvent | null> {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return null
    }

    const hosts: Host[] =
      parseJsonField<Host[]>(event.hosts as string | null) || []
    const featuredIn = parseJsonField<{ name: string; url: string }>(
      event.featuredIn as string | null
    )

    const publicEvent: PublicEvent = {
      title: event.title,
      subtitle: event.subtitle || '',
      date: event.startDate.toISOString().split('T')[0],
      startTime: event.startDate.toLocaleTimeString(),
      endTime: event.endDate.toLocaleTimeString(),
      location: event.location || '',
      city: event.city || '',
      description: event.description || '',
      backgroundColor: event.backgroundColor || '#000000',
      hosts: hosts,
      featuredIn: featuredIn,
      heroImage: event.heroImage || event.openGraphImage || ''
    }

    return publicEvent
  } catch (error) {
    console.error('Error fetching event:', error)
    throw new Error(`Failed to fetch event: ${error}`)
  }
}

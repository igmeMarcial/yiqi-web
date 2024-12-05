'use server'

import prisma from '@/lib/prisma'
import { ticketEventSchema } from '@/schemas/ticketSchema'
import { getPublicEvents } from '../event/getPublicEvents'

export async function getTicketsWithEvents(userId: string) {
  const tickets = await prisma.ticket.findMany({
    where: { userId },
    include: { registration: true }
  })

  const events = await getPublicEvents()

  const eventsList = events.events || []

  const ticketsWithEvents = eventsList
    .map(event => {
      const eventTickets = tickets
        .filter(ticket => ticket.registration?.eventId === event.id)
        .map(ticket => ({
          ...ticket,
          status: ticket.registration?.status
        }))

      return { event, tickets: eventTickets }
    })
    .filter(item => item.tickets.length > 0)

  return ticketEventSchema.parse(ticketsWithEvents)
}

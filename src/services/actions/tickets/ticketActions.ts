'use server'

import prisma from '@/lib/prisma'
import { ticketEventSchema } from '@/schemas/ticketSchema'

export async function getTicketsWithEvents(userId: string) {
  const tickets = await prisma.ticket.findMany({
    where: { userId },
    include: {
      registration: true,
      ticketType: {
        include: {
          event: {
            include: {
              organization: {
                select: {
                  id: true,
                  name: true,
                  logo: true
                }
              }
            }
          }
        }
      }
    }
  })

  const events = await prisma.event.findMany({
    where: {
      deletedAt: null,
      tickets: {
        some: {
          Ticket: {
            some: {
              userId
            }
          }
        }
      }
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          logo: true
        }
      }
    }
  })

  const ticketsWithEvents = events.map(event => {
    const eventTickets = tickets
      .filter(ticket => ticket.ticketType.event.id === event.id)
      .map(ticket => ({
        id: ticket.id,
        description: ticket.ticketType.description,
        registrationId: ticket.registrationId,
        userId: ticket.userId,
        checkedInDate: ticket.checkedInDate,
        checkedInByUserId: ticket.checkedInByUserId,
        category: ticket.ticketType.category,
        ticketTypeId: ticket.ticketType.id,
        registration: ticket.registration,
        status: ticket.registration?.status || 'PENDING'
      }))

    return {
      event: {
        id: event.id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        openGraphImage: event.openGraphImage || '',
        type: event.type === 'IN_PERSON' ? 'IN_PERSON' : 'VIRTUAL',
        organizationId: event.organizationId,
        organization: {
          id: event.organization.id,
          name: event.organization.name,
          logo: event.organization.logo || ''
        }
      },
      tickets: eventTickets
    }
  })

  return ticketEventSchema.parse(ticketsWithEvents)
}

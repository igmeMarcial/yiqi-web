'use server'

import prisma from '@/lib/prisma'
import { PublicEventSchema } from '@/schemas/eventSchema'
import { EventTypes, Prisma } from '@prisma/client'

// Variable para cache de ubicaciones
let locationCache: { data: string[]; timestamp: number } | null = null
const CACHE_EXPIRATION = 18000000 // 5 horas en milisegundos

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

  // Verificar cache en memoria
  let locationsList: string[]
  if (
    locationCache &&
    now.getTime() - locationCache.timestamp < CACHE_EXPIRATION
  ) {
    // Si el cache es válido (menos de 5 horas)
    console.log('proviene del cache')
    locationsList = locationCache.data
  } else {
    const locations = await prisma.event.findMany({
      where: whereClause,
      select: {
        location: true
      },
      distinct: ['location']
    })

    locationsList = locations.map(event => event.location ?? '')
    console.log('proviene de la db')

    // Guardar las ubicaciones en cache en memoria con timestamp
    locationCache = {
      data: locationsList,
      timestamp: now.getTime()
    }
  }

  return {
    events: events.map(event =>
      PublicEventSchema.parse({
        ...event,
        registrations: event.registrations.length
      })
    ),
    locations: locationsList
  }
}

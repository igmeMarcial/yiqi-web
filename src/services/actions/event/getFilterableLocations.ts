'use server'

import prisma from '@/lib/prisma'

export async function getFilterableLocations() {
  const cities = await prisma.event.findMany({
    select: {
      city: true
    },
    distinct: ['city']
  })

  const cityList = cities.map(event => event.city ?? '')

  console.log('Ciudades obtenidas de la base de datos')

  return cityList
}

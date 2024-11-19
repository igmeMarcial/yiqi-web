import prisma from '@/lib/prisma'

type CacheProps = {
  cities: string[]
  timeCalculated: Date | null
}
const cache: CacheProps = {
  cities: [],
  timeCalculated: null
}

export async function getDistinctCities() {
  if (cache.timeCalculated && cache.cities.length > 0) {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    if (cache.timeCalculated > twoHoursAgo) {
      return cache.cities
    }
  }

  const cities = await prisma.event
    .findMany({
      select: {
        city: true,
        country: true
      },
      distinct: ['city', 'country'],
      where: {
        city: {
          not: null
        },
        deletedAt: {
          equals: null
        },
        startDate: {
          gte: new Date()
        }
      }
    })
    .then(events => events.map(event => event.city))

  cache.cities = cities.filter(v => typeof v === 'string')
  cache.timeCalculated = new Date()

  return cache.cities
}

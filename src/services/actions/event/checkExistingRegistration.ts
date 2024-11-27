'use server'

import prisma from '@/lib/prisma'
import { EventRegistrationSchema } from '@/schemas/eventSchema'

export async function checkExistingRegistration(
  eventId: string,
  email: string
) {
  try {
    const registration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        user: {
          email: email.toLowerCase()
        }
      },
      include: {
        tickets: {
          include: {
            user: true
          }
        },
        user: true,
        event: true
      }
    })

    console.log(registration)
<<<<<<< HEAD
    return EventRegistrationSchema.parse(registration)
=======
    return registration ? EventRegistrationSchema.parse(registration) : null
>>>>>>> fd5523954c7d0d5d22b9df3c22441a08a8683bea
  } catch (error) {
    console.error('Error checking registration:', error)
    return null
  }
}

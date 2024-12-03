'use server'

import { getUser } from '@/lib/auth/lucia'
import { type RegistrationInput } from '@/schemas/eventSchema'
import { createRegistration as createRegistrationFn } from '@/lib/event/createRegistration'

export async function createRegistration(
  eventId: string,
  registrationData: RegistrationInput
) {
  const signedInUser = await getUser()

  return await createRegistrationFn(signedInUser, eventId, registrationData)
}

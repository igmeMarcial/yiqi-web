'use server'

import prisma from '@/lib/prisma'
import { userDataCollectedShema } from '@/schemas/userSchema'
import { getUser } from '@/lib/auth/lucia'

export async function saveNetworkingProfile(formData: FormData) {
  const user = await getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    // Get existing user data
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { dataCollected: true }
    })

    const existingData = existingUser?.dataCollected ?? {}

    // Prepare new data
    const newData = {
      professionalMotivations: formData.get('professionalMotivations'),
      communicationStyle: formData.get('communicationStyle'),
      professionalValues: formData.get('professionalValues'),
      careerAspirations: formData.get('careerAspirations'),
      significantChallenge: formData.get('significantChallenge')
    }

    // Merge existing data with new data
    const mergedData = {
      ...(existingData as Record<string, unknown>),
      ...newData
    }

    const validatedData = userDataCollectedShema.parse(mergedData)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        dataCollected: validatedData
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error saving networking profile:', error)
    return { error: 'Failed to save networking profile' }
  }
}

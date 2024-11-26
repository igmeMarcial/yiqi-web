'use server'

import prisma from '@/lib/prisma'
import { userDataCollectedShema } from '@/schemas/userSchema'
import { getUser } from '@/lib/auth/lucia'
import { extractTextFromFile } from '@/lib/aws/textract'

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

    const existingData = userDataCollectedShema.parse(
      existingUser?.dataCollected
    )

    // Get the new resume URL and last updated timestamp
    const resumeUrl = formData.get('resumeUrl') as string | null
    const resumeLastUpdated = formData.get('resumeLastUpdated') as string | null

    // Check if we need to extract new text
    let resumeText = existingData.resumeText
    if (
      resumeUrl &&
      resumeLastUpdated &&
      resumeLastUpdated !== existingData.resumeLastUpdated
    ) {
      try {
        const response = await fetch(resumeUrl)
        const fileBlob = await response.blob()
        const file = new File([fileBlob], 'resume', { type: fileBlob.type })
        resumeText = await extractTextFromFile(file)
      } catch (error) {
        console.error('Error extracting text:', error)
        // Continue with existing text if extraction fails
      }
    }

    // Prepare new data
    const newData = {
      professionalMotivations: formData.get('professionalMotivations'),
      communicationStyle: formData.get('communicationStyle'),
      professionalValues: formData.get('professionalValues'),
      careerAspirations: formData.get('careerAspirations'),
      significantChallenge: formData.get('significantChallenge'),
      resumeUrl,
      resumeText,
      resumeLastUpdated
    }

    // Merge with existing data
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
    console.error('Error in saveNetworkingProfile:', error)
    return { error: 'Failed to save networking profile' }
  }
}

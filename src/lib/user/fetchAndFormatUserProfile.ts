import { z } from 'zod'
import prisma from '@/lib/prisma'
import {
  privacySettingsSchema,
  ProfileWithPrivacy,
  profileWithPrivacySchema,
  UserDataCollected
} from '@/schemas/userSchema'
interface User {
  id: string
  [key: string]: string | number | boolean | Record<string, boolean> | undefined
  privacySettings: {
    [key: string]: boolean
  }
}
export const filterProfileData = (user: User): Partial<User> => {
  if (!user || !user.privacySettings) {
    throw new Error('Invalid user data or missing privacy settings')
  }

  const filteredData: Partial<User> = {}

  Object.keys(user.privacySettings).forEach(key => {
    if (user.privacySettings[key] && key in user) {
      filteredData[key] = user[key]
    }
  })

  return filteredData
}

export async function fetchAndFormatUserProfile(
  currentUserId: string,
  isCurrentUser: boolean
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: currentUserId }
    })

    if (!user) return null
    const { userDetailedProfile, userContentPreferences } = user
    const dataCollected = user.dataCollected as UserDataCollected
    const cleanUserData: ProfileWithPrivacy = {
      id: user.id,
      name: user.name ?? '',
      picture: user.picture ?? '',
      stopCommunication: user.stopCommunication ?? false,
      company: dataCollected?.company ?? '',
      position: dataCollected?.position ?? '',
      shortDescription: dataCollected?.shortDescription ?? '',
      isLinkedinLinked: !!user.linkedinAccessToken,
      privacySettings: privacySettingsSchema.parse(user.privacySettings),
      phoneNumber: user.phoneNumber ?? '',
      linkedin: dataCollected?.linkedin ?? '',
      email: user.email ?? '',
      x: dataCollected?.x ?? '',
      instagram: dataCollected?.instagram ?? '',
      website: dataCollected?.website ?? '',
      professionalMotivations: dataCollected?.professionalMotivations ?? '',
      communicationStyle: dataCollected?.communicationStyle ?? '',
      professionalValues: dataCollected?.professionalValues ?? '',
      careerAspirations: dataCollected?.careerAspirations ?? '',
      significantChallenge: dataCollected?.significantChallenge ?? '',
      role: user.role,
      resumeUrl: dataCollected?.resumeUrl ?? '',
      resumeLastUpdated: dataCollected?.resumeLastUpdated ?? '',
      resumeFileName: dataCollected?.resumeFileName ?? '',
      resumeText: dataCollected?.resumeText ?? '',
      userDetailedProfile,
      userContentPreferences
    }

    if (isCurrentUser) {
      return profileWithPrivacySchema.parse(cleanUserData)
    } else {
      return profileWithPrivacySchema.parse({
        id: user.id,
        name: user.name ?? '',
        picture: user.picture ?? '',
        stopCommunication: user.stopCommunication ?? false,
        company: dataCollected?.company ?? '',
        position: dataCollected?.position ?? '',
        shortDescription: dataCollected?.shortDescription ?? '',
        role: user.role,
        ...filterProfileData(cleanUserData as unknown as User)
      })
    }
  } catch (error) {
    console.error('Error in fetchAndFormatUserProfile:', error)
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
    }
    return null
  }
}

<<<<<<< HEAD:src/app/[locale]/(protected)/user/edit/page.tsx
import UpdateProfileForm from '@/components/profile-settings/UpdateProfileForm'
=======
import NetworkingProfileForm from '@/components/profile/NetworkingProfileForm'
>>>>>>> fd5523954c7d0d5d22b9df3c22441a08a8683bea:src/app/(protected)/user/networking-settings/page.tsx
import UserLayout from '@/components/user/UserLayout'
import { getUser } from '@/lib/auth/lucia'
import {
  profileDataSchema,
  profileWithPrivacySchema
} from '@/schemas/userSchema'
import { getUserProfile } from '@/services/actions/userActions'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export default async function page() {
  const userCurrent = await getUser()
  const t = await getTranslations('user')

  if (!userCurrent?.id) {
    return <div>{t('notFound')}</div>
  }

  const user = await getUserProfile(userCurrent.id)

  if (!user) {
    return <div>{t('notFound')}</div>
  }

  // Extract networking specific data
  const networkingData = {
    professionalMotivations: user.professionalMotivations,
    communicationStyle: user.communicationStyle,
    professionalValues: user.professionalValues,
    careerAspirations: user.careerAspirations,
    significantChallenge: user.significantChallenge
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <UserLayout userProps={profileDataSchema.parse(user)}>
<<<<<<< HEAD:src/app/[locale]/(protected)/user/edit/page.tsx
        <UpdateProfileForm user={profileWithPrivacySchema.parse(user)} />
=======
        <NetworkingProfileForm initialData={networkingData} />
>>>>>>> fd5523954c7d0d5d22b9df3c22441a08a8683bea:src/app/(protected)/user/networking-settings/page.tsx
      </UserLayout>
    </main>
  )
}

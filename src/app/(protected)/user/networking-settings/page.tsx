import NetworkingProfileForm from '@/components/profile/NetworkingProfileForm'
import UserLayout from '@/components/user/UserLayout'
import { getUser } from '@/lib/auth/lucia'
import { profileDataSchema } from '@/schemas/userSchema'
import { getUserProfile } from '@/services/actions/userActions'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import React from 'react'

export default async function page() {
  const userCurrent = await getUser()

  if (!userCurrent?.id) {
    await cookies().set('redirect', '/networking-settings')
    return redirect('/auth')
  }

  const user = await getUserProfile(userCurrent.id)

  if (!user) {
    await cookies().set('redirect', '/networking-settings')
    return redirect('/auth')
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
        <NetworkingProfileForm
          userId={userCurrent.id}
          initialData={networkingData}
        />
      </UserLayout>
    </main>
  )
}

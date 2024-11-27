import UpdateProfileForm from '@/components/profile-settings/UpdateProfileForm'
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

  return (
    <main className="flex flex-col items-center justify-center">
      <UserLayout userProps={profileDataSchema.parse(user)}>
        <UpdateProfileForm user={profileWithPrivacySchema.parse(user)} />
      </UserLayout>
    </main>
  )
}

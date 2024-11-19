import UpdateProfileForm from '@/components/profile-settings/UpdateProfileForm'
import UserLayout from '@/components/user/UserLayout'
import { getUser } from '@/lib/auth/lucia'
import { getUserProfile } from '@/services/actions/userActions'
import React from 'react'

export default async function page() {
  const userCurrent = await getUser()

  if (!userCurrent?.id) {
    return <div>User not found</div>
  }

  const user = await getUserProfile(userCurrent.id)

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <UserLayout userProps={user}>
        <UpdateProfileForm user={user} />
      </UserLayout>
    </main>
  )
}

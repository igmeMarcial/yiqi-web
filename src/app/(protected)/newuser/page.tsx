import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import OnboardingQuestionnaire from '@/components/onboarding/OnboardingQuestionnaire'
import { getUserProfile } from '@/services/actions/userActions'

export default async function Page() {
  const user = await getUser()
  if (!user) {
    redirect(`/auth`)
  }

  const userProfile = await getUserProfile(user.id)

  if (user.role === Roles.NEW_USER) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="flex-1 w-full">
          <OnboardingQuestionnaire userProfile={userProfile} userId={user.id} />
        </div>
      </main>
    )
  } else if (user.role === Roles.ADMIN) {
    redirect(`/admin`)
  } else if (user.role === Roles.USER) {
    redirect('/newuser/passthru')
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect(`/andino-admin`)
  }
}

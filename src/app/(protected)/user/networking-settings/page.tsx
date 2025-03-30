import NetworkingSettingsManager from '@/components/profile/NetworkingSettingsManager'
import { profileDataSchema } from '@/schemas/userSchema'
import { getUserOrRedirect } from '@/lib/auth/getUserOrRedirect'
import UserLayout from '@/components/user/UserLayout'
import { getUserProfile } from '@/services/actions/userActions'

export default async function page() {
  const { user } = await getUserOrRedirect()
  const userProfile = await getUserProfile(user.id)

  return (
    <main className="flex flex-col items-center justify-center">
      <UserLayout userProps={profileDataSchema.parse(user)}>
        <NetworkingSettingsManager
          user={user}
          initialData={{
            professionalMotivations: userProfile?.professionalMotivations || '',
            communicationStyle: userProfile?.communicationStyle || '',
            professionalValues: userProfile?.professionalValues || '',
            careerAspirations: userProfile?.careerAspirations || '',
            significantChallenge: userProfile?.significantChallenge || '',
            resumeUrl: userProfile?.resumeUrl || '',
            resumeText: userProfile?.resumeText || '',
            resumeLastUpdated: userProfile?.resumeLastUpdated || '',
            resumeFileName: userProfile?.resumeFileName || ''
          }}
        />
      </UserLayout>
    </main>
  )
}

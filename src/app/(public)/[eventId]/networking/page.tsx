import MainLandingNav from '@/components/mainLanding/mainNav'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { MatchesList } from './_temp/tempcomp'
import { getNetworkingMatchesByEventUser } from '@/services/actions/networking/getNetworkingMatches'

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  console.log('Event ID:', params.eventId) // Log the eventId

  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }

  const matches = await getNetworkingMatchesByEventUser(user.id, params.eventId)
  console.warn(matches)

  if (matches.length > 0) {
    return (
      <>
        <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
        <MainLandingNav user={user!} />
        <div className="lg:max-w-[80%] max-w-[90%] mx-auto pt-20">
          <MatchesList matches={matches} />
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
        <MainLandingNav user={user!} />
        <div className="lg:max-w-[80%] max-w-[90%] mx-auto pt-20">
          <p className="text-xl">No hay matches para ti</p>
        </div>
      </>
    )
  }
}

import MainLandingNav from '@/components/mainLanding/mainNav'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { MatchesList } from './_temp/tempcomp'
import { getNetworkingMatches } from '@/services/actions/networking/getNetworkingMatches'

export default async function Page() {
  const user = await getUser()
  if (!user) {
    redirect('/auth')
  }

  const matches = await getNetworkingMatches(user.id)
  console.warn(matches)

  if (matches.map(v => v.id)) {
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
          <p className="text-xl"> no hay matches para ti</p>
        </div>
      </>
    )
  }
}

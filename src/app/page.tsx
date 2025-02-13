import CommunityHighlights from '@/components/mainLanding/CommunityHighlights'
import Features from '@/components/mainLanding/Features'
import Footer from '@/components/mainLanding/Footer'
import Hero from '@/components/mainLanding/hero'
import MainLandingNav from '@/components/mainLanding/mainNav'
import PublicEventsList from '@/components/events/PublicEventsList'
import { getUser } from '@/lib/auth/lucia'
import { getPublicEvents } from '@/services/actions/event/getPublicEvents'
import getCommunities from '@/services/actions/communities/getCommunities'
import { OngoingEventBanner } from '@/components/mainLanding/OngoingEventBanner'
import { getUserOngoingEvent } from '@/services/actions/event/getUserOngoingEvent'
import { validateCheckIn } from '@/services/actions/event/validateCheckIn'

export default async function Home() {
  const user = await getUser()
  const { events } = await getPublicEvents({ limit: 8 })
  const { communities } = await getCommunities({ limit: 8 })
  const ongoingEvent = await getUserOngoingEvent(user?.email)

  let isUserCheckedInOngoingEvent = false
  if (user && ongoingEvent)
    isUserCheckedInOngoingEvent = await validateCheckIn(
      ongoingEvent.id,
      user.id
    )

  return (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
      <MainLandingNav user={user!} />
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto pt-20">
        {ongoingEvent ? (
          <OngoingEventBanner
            user={user!}
            event={ongoingEvent}
            isUserCheckedInOngoingEvent={isUserCheckedInOngoingEvent}
          />
        ) : null}
        <Hero />
        <Features />
        <CommunityHighlights communities={communities} />
        <PublicEventsList events={events} />
      </div>
      <Footer />
    </>
  )
}

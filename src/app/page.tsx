import CommunityHighlights from '@/components/mainLanding/CommunityHighlights'
import Features from '@/components/mainLanding/Features'
import Footer from '@/components/mainLanding/Footer'
import Hero from '@/components/mainLanding/hero'
import MainLandingNav from '@/components/mainLanding/mainNav'
import PublicEventsList from '@/components/events/PublicEventsList'
import { getUser } from '@/lib/auth/lucia'
import { getPublicEvents } from '@/services/actions/event/getPublicEvents'

export default async function Home() {
  const user = await getUser()
  const response = await getPublicEvents({})

  console.log(response)

  const events = Array.isArray(response.events) ? response.events : []

  return (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
      <MainLandingNav
        user={{ name: user?.name, picture: user?.picture as string }}
      />
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto">
        <Features />
        {/* Community Highlights */}
        <CommunityHighlights />
        {/* Upcoming Events Section */}
        <PublicEventsList events={events} />
      </div>
      <Footer />
    </>
  )
}

import { EventPage } from '@/components/lumalike/template1'
import { getUser } from '@/lib/auth/lucia'
import { getEventById } from '@/services/actions/event/getEventById'
import { redirect } from 'next/navigation'

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const user = await getUser()

  const event = await getEventById(params.eventId)

  if (!event) {
    redirect('/')
  }

  return (
    <>
      <EventPage
        event={event}
        user={{
          email: user?.email,
          name: user?.name
        }}
      />
    </>
  )
}

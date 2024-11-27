import { EventPage } from '@/components/lumalike/template1'
import { getEventById } from '@/services/actions/event/getEventById'
import { redirect } from 'next/navigation'

export default async function Page({
  params
}: {
  params: { eventId: string }
}) {
  const event = await getEventById(params.eventId)
  
  if (!event) {
    redirect('/')
  }

  return (
    <>
      <EventPage event={event} />
    </>
  )
}

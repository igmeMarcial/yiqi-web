import { EventForm } from '@/components/events/EventForm'
import { MantineProvider } from '@/components/providers/mantine-provider'
import { getEvent } from '@/services/actions/event/getEvent'
import { getOrganization } from '@/services/actions/organizationActions'
import { notFound } from 'next/navigation'

export default async function Page({
  params
}: {
  params: { eventId: string; id: string }
}) {
  const organization = await getOrganization(params.id)
  const event = await getEvent(params.eventId, true)

  if (!event || !organization) {
    notFound()
  }

  return (
    <MantineProvider>
      <div>
        <EventForm
          organizationId={organization.id}
          hasStripeAccount={organization?.stripeAccountId !== null}
          event={event}
        />
      </div>
    </MantineProvider>
  )
}

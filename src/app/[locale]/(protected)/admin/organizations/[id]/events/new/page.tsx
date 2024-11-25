import { EventForm } from '@/components/events/EventForm'
import { EventText2 } from '@/components/orgs/OrganizationLayout'
import { getOrganization } from '@/services/actions/organizationActions'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const organization = await getOrganization(params.id)

  if (!organization) {
    notFound()
  }

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <EventText2 id={params.id} />
        <EventForm
          organizationId={params.id}
          hasStripeAccount={organization?.stripeAccountId !== null}
        />
      </div>
    </div>
  )
}

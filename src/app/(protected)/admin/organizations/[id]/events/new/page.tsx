import { EventForm } from '@/components/events/EventForm'
import { getOrganization } from '@/services/actions/organizationActions'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const organization = await getOrganization(params.id)

  if (!organization) {
    notFound()
  }

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Event</h1>
          <Link
            href={`/admin/organizations/${params.id}/events`}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
        <EventForm
          organizationId={params.id}
          hasStripeAccount={organization?.stripeAccountId !== null}
        />
      </div>
    </div>
  )
}

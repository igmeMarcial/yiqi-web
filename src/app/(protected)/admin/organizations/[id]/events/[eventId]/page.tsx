import { getEvent } from '@/services/actions/event/getEvent'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { EventAdminView } from '@/components/EventAdminView'
import { getEventRegistrations } from '@/services/actions/event/getEventAttendees'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Link2, Pencil } from 'lucide-react'
import { MdPreview } from '@/components/events/editor/MdPreview'

export default async function EventDetailsPage({
  params
}: {
  params: { id: string; eventId: string }
}) {
  const event = await getEvent({ eventId: params.eventId })
  const user = await getUser()
  const attendees = await getEventRegistrations(params.eventId)

  const t = await getTranslations('DeleteAccount')

  if (!event) {
    return <div>{t('eventNotFound')}</div>
  }

  if (!user) {
    redirect(`/auth`)
  }

  if (user.role === Roles.ADMIN) {
    return (
      <main className="flex flex-col items-center justify-center">
        <OrganizationLayout
          orgId={params.id}
          userProps={{
            id: user.id,
            picture: user.picture!,
            email: user.email,
            name: user.name
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              {t('eventTitleInEventDetails')} {event.title}
            </h1>
            <div className="flex space-x-2">
              <Link
                href={`/admin/organizations/${params.id}/events/${params.eventId}/edit`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-4 py-2"
              >
                <Pencil />
              </Link>
              <Link
                href={`/${params.eventId}`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-4 py-2"
              >
                <Link2 />
              </Link>
              <Link
                href={`/admin/organizations/${params.id}/events`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-4 py-2"
              >
                {t('backToEvents')}
              </Link>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2">
                {t('deleteEvent')}
              </button>
            </div>
          </div>

          <section className="border rounded-md p-4">
            <h2 className="text-xl font-bold mb-2">{t('eventDetails')}</h2>
            <div className="flex justify-between mb-2">
              <div>
                <span className="font-semibold">{t('startDate')}</span>
                <p>{new Date(event.startDate).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-semibold">{t('endDate')}</span>
                <p>{new Date(event.endDate).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <span className="font-semibold">{t('description')}</span>

              <div className="prose prose-sm max-w-none mb-4  dark:prose-invert">
                <MdPreview content={event.description!} />
              </div>
            </div>
          </section>

          <EventAdminView registrations={attendees} eventId={params.eventId} />
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/newuser`)
  } else if (user.role === Roles.USER) {
    redirect(`/user`)
  }
}

import { getEventRegistrations } from '@/services/actions/eventActions'
import EventCheckinTable from '@/components/events/EventCheckinTable'
import { getEventData } from '@/lib/event/getEventData'
import BackButton from '@/components/tickets/backButton/BackButton'
import { translations } from '@/lib/translations/translations'

export default async function CheckinPage({
  params
}: {
  params: { id: string; eventId: string; ticketId: string }
}) {
  const { organization, event, isAdmin, notFound } = await getEventData(
    params.id,
    params.eventId
  )

  if (notFound) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">
            {translations.es.checkInQrEventNotFound}
          </h1>
          <p className="mt-2 text-gray-600">
            {translations.es.checkInQrEventDontExist}
          </p>
          <BackButton />
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold text-red-600">
            {translations.es.checkInQrDontAccess}
          </h1>
          <p className="mt-4 text-gray-700">
            {translations.es.checkInQrContactAdministrator}
          </p>
          <BackButton />
        </div>
      </div>
    )
  }

  if (!organization || !event) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">
            {translations.es.checkInQrOrganizationEventDontFound}
          </h1>
          <p className="mt-2 text-gray-600">
            {translations.es.checkInQrInformation}
          </p>
        </div>
        <BackButton />
      </div>
    )
  }

  const registrations = await getEventRegistrations(params.eventId)

  return (
    <div className="container mx-auto max-w-screen-lg p-4 space-y-4 pt-10">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        {translations.es.eventCheckInTableTitle} {event.title}
      </h1>

      <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-md p-4">
        <EventCheckinTable
          eventId={event.id}
          registrations={registrations}
          ticketId={params.ticketId}
        />
      </div>
    </div>
  )
}

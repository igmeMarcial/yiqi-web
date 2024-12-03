import { getOrganization } from '@/services/actions/organizationActions'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'

import Link from 'next/link'
import { getOrganizationEvents } from '@/services/actions/event/getOrganizationEvents'
import { getTranslations } from 'next-intl/server'
import { Eye, Trash } from 'lucide-react'

export default async function EventsPage({
  params
}: {
  params: { id: string }
}) {
  const t = await getTranslations('contactFor')

  const organization = await getOrganization(params.id)
  const user = await getUser()
  const events = await getOrganizationEvents(params.id)

  if (!organization) {
    return <div>{t('organizationNotFound')}</div>
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
          <section className="w-full py-6 p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{t('events')}</h1>
              <div className="flex flex-col sm:flex-row sm:justify-end items-center sm:items-end sm:mt-0">
                <Link
                  href={`/admin/organizations/${params.id}/events/new`}
                  className="font-bold text-primary hover:opacity-90 transition-opacity rounded-md text-center w-full sm:w-auto px-4 py-2"
                  style={{ paddingLeft: '1.2rem', paddingRight: '1.2rem', whiteSpace: 'normal', backgroundColor: 'gray' }}
                >
                  {t('createNewEvents')}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {events.map(event => (
                <div
                  key={event.id}
                  className="relative bg-gray-800 p-4 rounded-md hover:bg-gray-700 transition-all"
                >
                  <h3 className="text-xl font-semibold text-primary truncate sm:whitespace-normal sm:overflow-visible sm:text-ellipsis">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{new Date(event.startDate).toLocaleString()}</p>

                  {/* Íconos para ver y eliminar */}
                  <div className="absolute top-4 right-4 flex space-x-3">
                    <Link
                      href={`/admin/organizations/${params.id}/events/${event.id}`}
                      className="text-gray-300 hover:text-primary"
                    >
                      <Eye className="w-5 h-5 text-primary" />
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-500"
                    >
                      <Trash className="w-5 h-5 text-primary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/newuser`)
  } else if (user.role === Roles.USER) {
    redirect(`/user`)
  }
}

const handleDelete = (eventId: string) => {
  // eliminar el evento
  console.log(`Eliminar evento con ID: ${eventId}`)
}

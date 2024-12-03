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
          <section className="w-full p-4 rounded-lg border text-card-foreground shadow-sm h-screen max-w-4xl mx-auto bg-primary mx-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{t('events')}</h1>
              <div className="flex flex-col sm:flex-row sm:justify-end items-center sm:items-end sm:mt-0">
                <Link
                  href={`/admin/organizations/${params.id}/events/new`}
                  className="font-bold text-primary hover:opacity-90 transition-opacity rounded-md text-center w-full sm:w-auto px-4 py-2"
                  style={{
                    paddingLeft: '1.2rem',
                    paddingRight: '1.2rem',
                    whiteSpace: 'normal',
                    backgroundColor: 'gray'
                  }}
                >
                  {t('createNewEvents')}
                </Link>
              </div>
            </div>

            <div className="w-full">
              {/* Encabezado para la tabla */}
              <div className="hidden sm:grid grid-cols-12 bg-gray-700 p-4 rounded">
                <div className="col-span-6 text-sm font-semibold text-primary">
                  Title
                </div>
                <div className="col-span-3 text-sm font-semibold text-primary">
                  Date
                </div>
                <div className="col-span-3 text-sm font-semibold text-primary text-right">
                  Actions
                </div>
              </div>

              <div>
                {events.map(event => (
                  <div
                    key={event.id}
                    className="relative flex flex-row items-center dark:bg-primary p-4 border-b border-gray-700 last:rounded-b-md hover:bg-gray-700 transition-all"
                  >
                    {/* En mobile: Contenedor general */}
                    <div className="flex flex-row w-full">
                      {/* Título y Fecha */}
                      <div className="flex-1 flex flex-col">
                        {/* Título */}
                        <div className="text-lg font-semibold dark:text-primary truncate">
                          {event.title}
                        </div>

                        {/* Fecha */}
                        <div className="text-sm text-gray-400 mt-1">
                          {new Date(event.startDate).toLocaleString()}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex justify-end space-x-3 mt-2 sm:mt-0">
                        <Link
                          href={`/admin/organizations/${params.id}/events/${event.id}`}
                          className="text-gray-300 hover:text-primary mt-4"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button className="text-red-600 hover:text-red-50 mt-2 sm:mt-0">
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

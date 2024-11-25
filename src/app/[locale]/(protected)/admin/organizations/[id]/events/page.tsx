import { getOrganization } from '@/services/actions/organizationActions'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout, {
  EventText
} from '@/components/orgs/OrganizationLayout'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'

import Link from 'next/link'
import { getOrganizationEvents } from '@/services/actions/event/getOrganizationEvents'

export default async function EventsPage({
  params
}: {
  params: { locale: string; id: string }
}) {
  const { locale } = params
  const organization = await getOrganization(params.id)
  const user = await getUser()
  const events = await getOrganizationEvents(params.id)
  if (!organization) {
    return <div>Organization not found</div>
  }

  if (!user) {
    redirect(`/${locale}/auth`)
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
          <section>
            <EventText id={params.id} />

            <div>
              {events.map(event => (
                <Link
                  href={`/${locale}/admin/organizations/${params.id}/events/${event.id}`}
                  key={event.id}
                  className="block p-4 border rounded-md cursor-pointer"
                >
                  {event.title} - {new Date(event.startDate).toLocaleString()}
                </Link>
              ))}
            </div>
          </section>
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/${locale}/newuser`)
  } else if (user.role === Roles.USER) {
    redirect(`/${locale}/user`)
  }
}

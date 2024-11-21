import { getOrganization } from '@/services/actions/organizationActions'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'

import { getOrganizationEvents } from '@/services/actions/event/getOrganizationEvents'
import { EventList } from '@/components/EventList'

export default async function EventsPage({
  params
}: {
  params: { id: string }
}) {
  const organization = await getOrganization(params.id)
  const user = await getUser()
  const events = await getOrganizationEvents(params.id)
  if (!organization) {
    return <div>Organization not found</div>
  }

  if (!user) {
    redirect('/auth')
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
            <EventList events={events} orgId={params.id} />
          </section>
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  } else if (user.role === Roles.USER) {
    redirect('/user')
  }
}

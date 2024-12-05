import { getOrganization } from '@/services/actions/organizationActions'
import { getOrganizersByOrganization } from '@/services/actions/organizerActions'
import Link from 'next/link'
import AddOrganizerButton from './AddOrganizerButton'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getUser } from '@/lib/auth/lucia'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function OrganizersPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  const organization = await getOrganization(params.id)
  const organizers = await getOrganizersByOrganization(params.id)

  const t = await getTranslations('contactFor')
  const localActive = await getLocale()

  if (!organization || !user) {
    return <div>{t('organizationNotFound')}</div>
  }

  return (
    <OrganizationLayout
      orgId={params.id}
      userProps={{
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture ?? ''
      }}
    >
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          {t('manageOrganizersFor')} {organization.name}
        </h1>
        <ul className="space-y-2">
          {organizers.map(organizer => (
            <li key={organizer.id} className="border p-2 rounded">
              {organizer.user.name} - {organizer.role}
            </li>
          ))}
        </ul>
        <AddOrganizerButton organizationId={params.id} />
        <Link
          href={`/${localActive}/admin/organizations/${params.id}`}
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          {t('backToOrganizationDashboard')}
        </Link>
      </div>
    </OrganizationLayout>
  )
}

import { getOrganization } from '@/services/actions/organizationActions'
import { getOrganizationContacts } from '@/services/actions/contactActions'
import { getUser } from '@/lib/auth/lucia'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import ContactsList from '@/components/ContactsList'

export default async function ContactsPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  const organization = await getOrganization(params.id)
  const contacts = await getOrganizationContacts(params.id)

  if (!organization || !user) {
    return <div>Organization not found</div>
  }

  return (
    <OrganizationLayout
      orgId={params.id}
      userProps={{
        id: user.id,
        picture: user.picture!,
        email: user.email,
        name: user.name
      }}
    >
      <ContactsList organization={organization} contacts={contacts} />
    </OrganizationLayout>
  )
}

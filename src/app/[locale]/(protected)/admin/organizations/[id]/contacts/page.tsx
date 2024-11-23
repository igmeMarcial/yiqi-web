import { getOrganization } from '@/services/actions/organizationActions'
import { getOrganizationContacts } from '@/services/actions/contactActions'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getUser } from '@/lib/auth/lucia'
import ContactText, { ContactText1 } from '@/components/contacts'
import Link from 'next/link'
import { ImportContactTemplateButton } from './ImportContactTemplateButton'
import { ImportContactButton } from './ImportContactButton'
import { getLocale, getTranslations } from 'next-intl/server'

export default async function ContactsPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  const t = await getTranslations('contactFor')
  const localActive = await getLocale()

  const organization = await getOrganization(params.id)
  const contacts = await getOrganizationContacts(params.id)

  if (!organization || !user) {
    return <ContactText1 />
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
      {/* i commented this out becaue page.tsx is a server component and i18 runs on the client side */}
      {/* <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            <span>{t('contactsFor')}</span> {organization.name}
          </h1>
          <ImportContactButton organizationId={organization.id} />
        </div>
        <div className="mb-4">
          <ImportContactTemplateButton />
        </div>
        <ul className="space-y-2">
          {contacts.map(user => (
            <li key={user?.id} className="border p-2 rounded">
              <Link
                href={`/${localActive}/admin/organizations/${params.id}/contacts/${user?.id}`}
                className="text-blue-500 hover:underline"
              >
                {user?.name} ({user?.email})
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={`/${localActive}/admin/organizations/${params.id}`}
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          <span>{t('backToDashboard')}</span>
        </Link>
<<<<<<< HEAD
      </div>

      {/* <ContactText
        contacts={contacts}
        id={user?.id}
        name={organization.name}
        organizationId={organization.id}
      /> */}

      <ContactText
        contacts={contacts}
        id={user?.id}
        name={organization.name}
        organizationId={organization.id}
      />
    </OrganizationLayout>
  )
}

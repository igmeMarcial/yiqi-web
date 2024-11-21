'use client'

import { ImportContactButton } from '@/app/(protected)/admin/organizations/[id]/contacts/ImportContactButton'
import { ImportContactTemplateButton } from '@/app/(protected)/admin/organizations/[id]/contacts/ImportContactTemplateButton'
import { useLanguage } from '@/hooks/useLanguage'
import Link from 'next/link'

export default function ContactsClient({
  organization,
  contacts
}: {
  organization: { id: string; name: string }
  contacts: Array<{ id: string; name: string; email: string }>
}) {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {t('contactsFor')} {organization.name}
        </h1>
        <ImportContactButton organizationId={organization.id} />
      </div>
      <div className="mb-4">
        <ImportContactTemplateButton />
      </div>
      <ul className="space-y-2">
        {contacts.map(user => (
          <li key={user.id} className="border p-2 rounded">
            <Link
              href={`/admin/organizations/${organization.id}/contacts/${user.id}`}
              className="text-blue-500 hover:underline"
            >
              {user.name} ({user.email})
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/admin/organizations/${organization.id}`}
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        {t('backToDashboard')}
      </Link>
    </div>
  )
}

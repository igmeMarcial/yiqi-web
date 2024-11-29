import React from 'react'
import StripeConnect from '@/components/billing/StripeConnect'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { getOrganization } from '@/services/actions/organizationActions'

export default async function OrganizationBillingPage({
  params
}: {
  params: { locale: string; id: string }
}) {
  const organization = await getOrganization(params.id)

  const user = await getUser()
  const { locale } = params
  if (!user) {
    redirect(`/${locale}/login`)
  }

  return (
    <OrganizationLayout orgId={params.id} userProps={user}>
      <StripeConnect
        accountId={params.id}
        stripeId={organization?.stripeAccountId || ''}
      />
    </OrganizationLayout>
  )
}

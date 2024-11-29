import React from 'react'
import StripeConnect from '@/components/billing/StripeConnect'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { getOrganization } from '@/services/actions/organizationActions'
import { stripe } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { translations } from '@/lib/translations/translations'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default async function OrganizationBillingPage({
  params
}: {
  params: { id: string }
}) {
  const organization = await getOrganization(params.id)
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  if (!organization) {
    redirect('/')
  }

  // If org has a Stripe account, check its status
  let stripeAccountStatus = null
  if (organization.stripeAccountId) {
    try {
      const account = await stripe.accounts.retrieve(
        organization.stripeAccountId
      )
      stripeAccountStatus = account.charges_enabled ? 'active' : 'pending'
    } catch (error) {
      console.error('Error fetching Stripe account:', error)
      stripeAccountStatus = 'error'
    }
  }

  return (
    <OrganizationLayout orgId={params.id} userProps={user}>
      {stripeAccountStatus === 'active' ? (
        <Card>
          <CardHeader>
            <CardTitle>{translations.es.stripeAccountActive}</CardTitle>
            <CardDescription>
              {translations.es.stripeAccountActiveDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full sm:w-auto">
              <a
                href={`https://dashboard.stripe.com/${organization.stripeAccountId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                {translations.es.stripeViewDashboard}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <StripeConnect
          accountId={params.id}
          stripeId={organization.stripeAccountId || ''}
        />
      )}
    </OrganizationLayout>
  )
}

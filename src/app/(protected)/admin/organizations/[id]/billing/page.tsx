import React from 'react'
import StripeConnect from '@/components/billing/StripeConnect'

export default function OrganizationBillingPage({
  params
}: {
  params: { id: string }
}) {
  return <StripeConnect accountId={params.id} />
}

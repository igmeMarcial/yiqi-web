'use client'
import { useState, useEffect, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js'
import { createCheckoutSession } from '@/services/actions/billing/createCheckoutSession'

export default function StripeCheckout({
  registrationId,
  onComplete
}: {
  onComplete: () => void
  registrationId: string
}) {
  const [clientSecret, setClientSecret] = useState('')
  const [stripeAccountId, setStripeAccountId] = useState('')

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const { clientSecret, connectAccountId } =
          await createCheckoutSession(registrationId)
        setClientSecret(clientSecret)
        setStripeAccountId(connectAccountId)
      } catch (error) {
        console.error('Error creating checkout session:', error)
      }
    }

    fetchClientSecret()
  }, [registrationId])

  const stripePromise = useMemo(() => {
    if (!stripeAccountId) return null

    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
      stripeAccount: stripeAccountId
    })
  }, [stripeAccountId])

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret, onComplete }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}

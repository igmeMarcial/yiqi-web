'use client'

import { useState } from 'react'
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding
} from '@stripe/react-connect-js'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Rocket, AlertCircle, Loader2 } from 'lucide-react'
import useStripeConnect from '@/hooks/useStripeConnect'
import { createConnectAccount } from '@/services/actions/billing/createAccount'
import { useTranslations } from 'next-intl'

export default function StripeConnect({
  accountId,
  stripeId
}: {
  accountId: string
  stripeId: string
}) {
  const [accountCreatePending, setAccountCreatePending] = useState(false)
  const [onboardingExited, setOnboardingExited] = useState(false)
  const [error, setError] = useState(false)
  const [connectedAccountId, setConnectedAccountId] = useState<string>(stripeId)
  const stripeConnectInstance = useStripeConnect(connectedAccountId)

  const t = useTranslations('StripeConnect')
  const handleSignUp = async () => {
    setAccountCreatePending(true)
    setError(false)
    try {
      const account = await createConnectAccount(accountId)
      setConnectedAccountId(account.id)
      console.log('account', account)
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setAccountCreatePending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            {t('stripeConnectTitle')}
          </CardTitle>
          <CardDescription>
            {!connectedAccountId
              ? t('stripeConnectDescription')
              : !stripeConnectInstance
                ? `${t('stripeConnectOnboardingDescription')}`
                : `${t('stripeConnectCompleteOnboarding')}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!connectedAccountId && (
            <p className="text-sm text-muted-foreground">
              {t('stripeConnectInfoText')}
            </p>
          )}

          {!accountCreatePending && !connectedAccountId && (
            <Button onClick={handleSignUp} className="w-full">
              {t('stripeConnectSignUp')}
            </Button>
          )}

          {accountCreatePending && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>{t('stripeConnectCreatingAccount')}</p>
            </div>
          )}

          {stripeConnectInstance && (
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectAccountOnboarding
                onExit={() => setOnboardingExited(true)}
              />
            </ConnectComponentsProvider>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('stripeConnectError')}</AlertTitle>
              <AlertDescription>
                {t('stripeConnectErrorDescription')}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        {(connectedAccountId || onboardingExited) && (
          <CardFooter className="flex flex-col items-start space-y-2 bg-muted/50 rounded-b-lg">
            {connectedAccountId && (
              <p className="text-sm">
                {t('stripeConnectAccountId')}{' '}
                <code className="font-mono bg-muted p-1 rounded">
                  {connectedAccountId}
                </code>
              </p>
            )}
            {onboardingExited && (
              <p className="text-sm text-muted-foreground">
                {t('stripeConnectOnboardingExited')}
              </p>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

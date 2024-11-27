'use client'

import React, { useCallback, useState } from 'react'
import { Button } from '../ui/button'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Users, Sparkles, Layout, Link2Off } from 'lucide-react'
import { cn } from '@/lib/utils'
import { disconnectLinkedin } from '@/services/actions/user/disconnectLinkedin'
import { toast } from '@/hooks/use-toast'
<<<<<<< HEAD
import { useTranslations } from 'next-intl'
=======
import { translations } from '@/lib/translations/translations'
>>>>>>> fd5523954c7d0d5d22b9df3c22441a08a8683bea

interface BenefitProps {
  icon: React.ReactNode
  title: string
  description: string
}

function Benefit({ icon, title, description }: BenefitProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="rounded-lg bg-primary/10 p-2">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function LinkedInLink() {
  const t = useTranslations('LinkedIn')
  const handleLinkClick = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_URL}${process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI}`
    const scope = 'r_fullprofile r_member_social'
    const state = 'random_string' // Use a secure random string
    const encodedRedirectUri = encodeURIComponent(redirectUri)
    const encodedScope = encodeURIComponent(scope)
    const encodedState = encodeURIComponent(state)
    console.log(clientId, redirectUri, scope, state)
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&scope=${encodedScope}&state=${encodedState}`

    window.location.href = authUrl
  }

  return (
    <Button onClick={() => handleLinkClick()} className="btn-linkedin">
<<<<<<< HEAD
      {t('linkAccount')}
=======
      {translations.es.linkedinConnectButton}
>>>>>>> fd5523954c7d0d5d22b9df3c22441a08a8683bea
    </Button>
  )
}
type Props = {
  isConnected: boolean
}
export default function LinkedInConnect({
  isConnected: isLinkedinConnected
}: Props) {
  const t = useTranslations('LinkedIn')

  const [isConnected, setIsConnected] = useState(isLinkedinConnected)

  const handleDisconnect = useCallback(async () => {
    const { success } = await disconnectLinkedin()
    if (success) {
      toast({
<<<<<<< HEAD
        title: `${t('linkedInDisconnected')}`,
        description: `${t('reconnect')}`
=======
        title: translations.es.linkedinDisconnectedToast,
        description: translations.es.linkedinDisconnectedToastDesc
>>>>>>> fd5523954c7d0d5d22b9df3c22441a08a8683bea
      })
      setIsConnected(false)
    } else {
      toast({
<<<<<<< HEAD
        title: `${t('errorDiconnecting')}`,
        description: `${t('tryAgain')}`
=======
        title: translations.es.linkedinErrorToast,
        description: translations.es.linkedinErrorToastDesc
>>>>>>> fd5523954c7d0d5d22b9df3c22441a08a8683bea
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl">
<<<<<<< HEAD
          {t('enhanceNetwork')}
        </CardTitle>
        <CardDescription className="text-base">
          {t('connectAccount')}
=======
          {translations.es.linkedinEnhanceTitle}
        </CardTitle>
        <CardDescription className="text-base">
          {translations.es.linkedinEnhanceDescription}
>>>>>>> fd5523954c7d0d5d22b9df3c22441a08a8683bea
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-1">
          <Benefit
            icon={<Users className="w-5 h-5 text-primary" />}
<<<<<<< HEAD
            title={t('personalizedMatch')}
            description={t('personalizedDescription')}
          />
          <Benefit
            icon={<Sparkles className="w-5 h-5 text-primary" />}
            title={t('communityHighlights')}
            description={t('stayUpdated')}
          />
          <Benefit
            icon={<Layout className="w-5 h-5 text-primary" />}
            title={t('personalizedContent')}
            description={t('contentBody')}
=======
            title={translations.es.linkedinBenefitMatchTitle}
            description={translations.es.linkedinBenefitMatchDescription}
          />
          <Benefit
            icon={<Sparkles className="w-5 h-5 text-primary" />}
            title={translations.es.linkedinBenefitHighlightsTitle}
            description={translations.es.linkedinBenefitHighlightsDescription}
          />
          <Benefit
            icon={<Layout className="w-5 h-5 text-primary" />}
            title={translations.es.linkedinBenefitContentTitle}
            description={translations.es.linkedinBenefitContentDescription}
>>>>>>> fd5523954c7d0d5d22b9df3c22441a08a8683bea
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {!isConnected && <LinkedInLink />}

        {isConnected && (
          <>
            <Button
              variant="outline"
              size="lg"
              className={cn('w-full sm:w-auto', !isConnected && 'hidden')}
              onClick={handleDisconnect}
            >
              <Link2Off className="w-5 h-5 mr-2" />
<<<<<<< HEAD
              {t('diconnectLinkedIn')}
            </Button>
            <p className="text-sm text-muted-foreground">
              {t('diconnectBody')}
=======
              {translations.es.linkedinDisconnectButton}
            </Button>
            <p className="text-sm text-muted-foreground">
              {translations.es.linkedinConnectedMessage}
>>>>>>> fd5523954c7d0d5d22b9df3c22441a08a8683bea
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

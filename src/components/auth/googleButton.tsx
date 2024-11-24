'use client'
import { Button } from '../ui/button'
import { getGoogleOauthConsentUrl } from '@/services/auth/auth'
import { useToast } from '@/hooks/use-toast'
import { GoogleIcon } from './icons'
import { useTranslations } from 'next-intl'

export default function GoogleOAuthButton() {
  const { toast } = useToast()
  const t = useTranslations('General')
  return (
    <Button
      className="flex flex-row gap-2 w-full"
      variant={'outline'}
      onClick={async () => {
        const res = await getGoogleOauthConsentUrl()
        if (res.url) {
          window.location.href = res.url
        } else {
          toast({
            title: 'ERROR:',
            description: `${res.error}`,
            variant: 'destructive'
          })
        }
      }}
    >
      `${t('withGoogle')}` <GoogleIcon />
    </Button>
  )
}

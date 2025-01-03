import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { getUserProfile } from '@/services/actions/userActions'
import type { EventRegistrationSchemaType } from '@/schemas/eventSchema'
import { checkExistingRegistration } from '@/services/actions/event/checkExistingRegistration'

interface PaymentConfirmedProps {
  eventId: string
  userEmail: string
}

export function PaymentConfirmed({
  eventId,
  userEmail
}: PaymentConfirmedProps) {
  const t = useTranslations('RegistrationComponent')
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false)
  const [registration, setRegistration] =
    useState<EventRegistrationSchemaType | null>(null)

  useEffect(() => {
    async function loadData() {
      const reg = await checkExistingRegistration(eventId, userEmail)
      if (reg) {
        setRegistration(reg)
        const profile = await getUserProfile(reg.userId)
        if (profile) {
          const incomplete =
            !profile.professionalMotivations ||
            !profile.communicationStyle ||
            !profile.professionalValues ||
            !profile.careerAspirations ||
            !profile.significantChallenge
          setIsProfileIncomplete(incomplete)
        }
      }
    }
    loadData()
  }, [eventId, userEmail])

  if (!registration) {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-semibold">
          {t('paymentConfirmedTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          {t('paymentConfirmedDescription')}
        </p>

        <div className="flex flex-col gap-4">
          <Button asChild variant="outline">
            <Link href={`/tickets/${registration.id}`}>{t('viewTickets')}</Link>
          </Button>

          {isProfileIncomplete && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <UserCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      {t('completeYourProfile')}
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {t('profileCompletionBenefits')}
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild>
                <Link href="/user/edit">{t('completeProfile')}</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

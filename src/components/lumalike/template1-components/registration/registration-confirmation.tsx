import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { EventRegistrationSchemaType } from '@/schemas/eventSchema'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface RegistrationConfirmationProps {
  registration: EventRegistrationSchemaType
}

export function RegistrationConfirmation({
  registration
}: RegistrationConfirmationProps) {
  const t = useTranslations('RegistrationComponent')
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-center">
          {registration.status === 'PENDING'
            ? `${t('registrationPending')}`
            : `${t('registrationConfirmed')}`}
        </CardTitle>
        <CardDescription className="text-center">
          {registration.status === 'PENDING'
            ? `${t('registrationPendingDescription')}`
            : `${t('registrationConfirmedDescription')}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Link href="/user/tickets">
            <Button>{t('viewMyTickets')}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

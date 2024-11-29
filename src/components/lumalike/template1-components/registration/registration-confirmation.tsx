import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { translations } from '@/lib/translations/translations'
import { EventRegistrationSchemaType } from '@/schemas/eventSchema'
import { Check, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import StripeCheckout from '@/components/billing/StripeCheckout'
import { useState } from 'react'
import { markRegistrationPaid } from '@/services/actions/event/markRegistrationPaid'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

interface RegistrationConfirmationProps {
  registration: EventRegistrationSchemaType
  requiresPayment?: boolean
}

export function RegistrationConfirmation({
  registration,
  requiresPayment = false
}: RegistrationConfirmationProps) {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const router = useRouter()

  const handlePaymentComplete = async () => {
    const result = await markRegistrationPaid(registration.id)
    if (result.success) {
      toast({
        title: translations.es.eventRegistrationSuccess
      })
      setIsPaymentDialogOpen(false)
      router.refresh()
    } else {
      toast({
        title: translations.es.eventRegistrationError,
        variant: 'destructive'
      })
    }
  }

  // Show payment pending state
  if (requiresPayment && !registration.paid) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-center">
            {translations.es.registrationPaymentPending}
          </CardTitle>
          <CardDescription className="text-center">
            {translations.es.registrationPaymentPendingDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog
            open={isPaymentDialogOpen}
            onOpenChange={setIsPaymentDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="w-full">
                {translations.es.registrationContinuePayment}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <StripeCheckout
                registrationId={registration.id}
                onComplete={handlePaymentComplete}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    )
  }

  // Show success state
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
            ? translations.es.registrationPending
            : translations.es.registrationConfirmed}
        </CardTitle>
        <CardDescription className="text-center">
          {registration.status === 'PENDING'
            ? translations.es.registrationPendingDescription
            : translations.es.registrationConfirmedDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Link href="/user/tickets">
            <Button>{translations.es.viewMyTickets}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

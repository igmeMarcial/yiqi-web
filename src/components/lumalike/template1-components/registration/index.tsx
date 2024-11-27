'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { translations } from '@/lib/translations/translations'
import {
  PublicEventType,
  registrationInputSchema,
  type RegistrationInput,
  type EventRegistrationSchemaType
} from '@/schemas/eventSchema'
import { useRouter } from 'next/navigation'
import { TicketSelection } from './ticket-selection'
import { RegistrationSummary } from './registration-summary'
import { RegistrationConfirmation } from './registration-confirmation'
import { checkExistingRegistration } from '@/services/actions/event/checkExistingRegistration'
import { createRegistration } from '@/services/actions/event/createRegistration'
import { toast } from '@/hooks/use-toast'
import { RegistrationForm } from './registration-form'

export type RegistrationProps = {
  event: PublicEventType
  user: {
    email: string | undefined
    name: string | undefined
  }
}

export function Registration({ event, user }: RegistrationProps) {
  const [ticketSelections, setTicketSelections] = useState<
    Record<string, number>
  >({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [existingRegistration, setExistingRegistration] =
    useState<EventRegistrationSchemaType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationInputSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      tickets: {}
    }
  })

  useEffect(() => {
    async function checkRegistration() {
      if (user?.email) {
        const registration = await checkExistingRegistration(
          event.id,
          user.email
        )
        setExistingRegistration(registration)
      }
      setIsLoading(false)
    }
    checkRegistration()
  }, [event.id, user?.email])

  const handleQuantityChange = (ticketId: string, change: number) => {
    setTicketSelections(prev => {
      const currentQty = prev[ticketId] || 0
      const newQty = Math.max(0, Math.min(5, currentQty + change))
      return { ...prev, [ticketId]: newQty }
    })
  }

  const calculateTotal = () => {
    return event.tickets.reduce((total, ticket) => {
      const quantity = ticketSelections[ticket.id] || 0
      return total + ticket.price * quantity
    }, 0)
  }

  const hasSelectedTickets = Object.values(ticketSelections).some(
    qty => qty > 0
  )
  const isFreeEvent = event.tickets.every(ticket => ticket.price === 0)

  const onSubmit = async (values: RegistrationInput) => {
    if (!hasSelectedTickets) {
      toast({
        title: translations.es.eventNoTicketsSelected,
        variant: 'destructive'
      })
      return
    }

    try {
      const result = await createRegistration(event.id, {
        ...values,
        tickets: ticketSelections
      })

      if (result.success) {
        toast({
          title: result.message
        })
        setIsDialogOpen(false)
        router.refresh()
      } else {
        toast({
          title: result.error,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error submitting registration:', error)
      toast({
        title: translations.es.eventRegistrationError,
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (existingRegistration) {
    return <RegistrationConfirmation registration={existingRegistration} />
  }

  return (
    <Card className="bg-primary-foreground/10 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Calendar className="h-6 w-6 text-primary text-white" />
          </div>
          <div>
            <div className="font-semibold text-lg mb-1 text-white">
              {isFreeEvent
                ? translations.es.eventFreeRegistration
                : translations.es.eventRegistration}
            </div>
            <p className="text-sm text-muted-foreground text-white">
              {isFreeEvent
                ? translations.es.eventFreeRegistrationDescription
                : translations.es.eventRegistrationDescription}
            </p>
          </div>
        </div>

        <Separator className="bg-white/20" />

        <TicketSelection
          tickets={event.tickets}
          ticketSelections={ticketSelections}
          onQuantityChange={handleQuantityChange}
          hasSelectedTickets={hasSelectedTickets}
          calculateTotal={calculateTotal}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="w-full text-white"
              disabled={!hasSelectedTickets}
            >
              {isFreeEvent
                ? translations.es.eventRegister
                : translations.es.eventPurchase}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {translations.es.eventRegistrationSummary}
              </DialogTitle>
              <DialogDescription>
                {user
                  ? translations.es.eventRegistrationDescriptionLoggedIn
                  : translations.es.eventRegistrationDescription}
              </DialogDescription>
            </DialogHeader>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RegistrationSummary
                tickets={event.tickets}
                ticketSelections={ticketSelections}
                calculateTotal={calculateTotal}
              />
              <RegistrationForm
                form={form}
                onSubmit={onSubmit}
                user={user}
                isFreeEvent={isFreeEvent}
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

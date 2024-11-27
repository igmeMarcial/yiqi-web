'use client'

import { useState } from 'react'
import { Calendar, Minus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { translations } from '@/lib/translations/translations'
import { PublicEventType } from '@/schemas/eventSchema'
import { toast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'

interface TicketSelection {
  [key: string]: number
}

const RegistrationSchema = z.object({
  name: z.string().min(2, {
    message: translations.es.eventFormNameError
  }),
  email: z.string().email({
    message: translations.es.eventFormEmailError
  })
})

type Props = { event: PublicEventType }

export function Registration({ event }: Props) {
  const [ticketSelections, setTicketSelections] = useState<TicketSelection>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  })

  const isFreeEvent = event.tickets.every(ticket => ticket.price === 0)
  const requiresApproval = event.requiresApproval

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

  function onSubmit(values: z.infer<typeof RegistrationSchema>) {
    if (!hasSelectedTickets) {
      toast({
        title: translations.es.eventNoTicketsSelected,
        variant: 'destructive'
      })
      return
    }
    // Handle form submission
    console.log({ ...values, tickets: ticketSelections })
  }

  const renderSummary = () => (
    <div className="space-y-4">
      <h3 className="font-medium">
        {translations.es.eventRegistrationSummary}
      </h3>
      <div className="space-y-2">
        {event.tickets.map(ticket => {
          const quantity = ticketSelections[ticket.id] || 0
          if (quantity === 0) return null
          return (
            <div key={ticket.id} className="flex justify-between">
              <span>{`${quantity}x ${ticket.name}`}</span>
              <span>
                {ticket.price === 0
                  ? translations.es.eventFree
                  : `$${(ticket.price * quantity).toFixed(2)}`}
              </span>
            </div>
          )
        })}
        <div className="border-t pt-2 font-medium flex justify-between">
          <span>{translations.es.eventTotal}</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Card className="bg-primary-foreground/10 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Calendar className="h-6 w-6 text-primary text-white" />
            </div>
            <div>
              <div className="font-semibold text-lg mb-1 text-white">
                {isFreeEvent && !requiresApproval
                  ? translations.es.eventFreeRegistration
                  : requiresApproval
                    ? translations.es.eventApprovalRequired
                    : translations.es.eventRegistration}
              </div>
              <p className="text-sm text-muted-foreground text-white">
                {isFreeEvent && !requiresApproval
                  ? translations.es.eventFreeRegistrationDescription
                  : translations.es.eventApprovalDescription}
              </p>
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* Ticket Selection */}
          <div className="space-y-4">
            {event.tickets.map(ticket => (
              <div key={ticket.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-white">{ticket.name}</h4>
                    <p className="text-sm text-white/80">
                      {ticket.description}
                    </p>
                  </div>
                  <div className="text-right text-white">
                    {ticket.price === 0
                      ? translations.es.eventFree
                      : `$${ticket.price.toFixed(2)}`}
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(ticket.id, -1)}
                    disabled={!ticketSelections[ticket.id]}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-white">
                    {ticketSelections[ticket.id] || 0}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(ticket.id, 1)}
                    disabled={ticketSelections[ticket.id] >= 5}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {hasSelectedTickets && (
            <>
              <Separator className="bg-white/20" />
              <div className="flex justify-between text-white font-medium">
                <span>{translations.es.eventTotal}</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </>
          )}

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
                  {translations.es.eventRegistrationDescription}
                </DialogDescription>
              </DialogHeader>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {renderSummary()}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.es.eventFormName}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                translations.es.eventFormNamePlaceholder
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations.es.eventFormEmail}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={
                                translations.es.eventFormEmailPlaceholder
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      {isFreeEvent
                        ? translations.es.eventConfirmRegistration
                        : translations.es.eventConfirmPurchase}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  )
}

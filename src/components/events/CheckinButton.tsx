'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { checkInUserToEvent } from '@/services/actions/eventActions'
import type { TicketSchema } from '@/schemas/eventSchema'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

type CheckinButtonProps = {
  ticket: z.infer<typeof TicketSchema>
  eventId: string
  selected?: boolean
}

export default function CheckinButton({
  ticket,
  eventId,
  selected = false
}: CheckinButtonProps) {
  const t = useTranslations("CheckIn")
  const [isOpen, setIsOpen] = useState(selected)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(!!ticket.checkedInDate)

  const handleCheckin = async () => {
    try {
      setIsLoading(true)
      await checkInUserToEvent(eventId, ticket.id)
      setIsCheckedIn(true)
      setIsOpen(false)
    } catch (error) {
      console.error('Error checking in user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckedIn) {
    return null
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        variant="default"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("checkingIn")}
          </>
        ) : (
          `${t("checkIn")}`
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirm")}</DialogTitle>
            <DialogDescription>
              {t("sure")}{' '}
              {ticket.user?.name || 'this user'}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleCheckin} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("checkingIn")}
                </>
              ) : (
                `${t("confirm")}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

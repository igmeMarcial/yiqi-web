'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ticket } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { QRModal } from '../qrModal/QrModal'
import { ticketEventSchemaType } from '@/schemas/ticketSchema'

interface TicketModalState {
  isOpen: boolean
  eventTitle: string
  attendeeName: string
  attendeeEmail: string
  ticketNumber: string
  eventId: string
  organizationId: string
  ticketId: string
  checkedInDate: string
}

const TicketStatusBadge = ({ status }: { status: string }) => {
  const badgeClass =
    status === 'APPROVED'
      ? 'bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
      : status === 'PENDING'
        ? 'bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'
        : 'bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'

  const badgeText =
    status === 'APPROVED'
      ? 'Aprobado'
      : status === 'PENDING'
        ? 'Pendiente'
        : 'Rechazado'

  return (
    <Badge
      variant={
        status === 'APPROVED'
          ? 'default'
          : status === 'PENDING'
            ? 'secondary'
            : 'destructive'
      }
      className={badgeClass}
    >
      {badgeText}
    </Badge>
  )
}

export default function TicketsPage({
  tickets
}: {
  tickets: ticketEventSchemaType
}) {
  const [modalState, setModalState] = useState<TicketModalState>({
    isOpen: false,
    eventTitle: '',
    attendeeName: '',
    attendeeEmail: '',
    ticketNumber: '',
    eventId: '',
    organizationId: '',
    ticketId: '',
    checkedInDate: ''
  })

  const openModal = (
    eventTitle: string,
    attendeeName: string,
    attendeeEmail: string,
    ticketNumber: string,
    eventId: string,
    organizationId: string,
    ticketId: string,
    checkedInDate: string
  ) => {
    setModalState({
      isOpen: true,
      eventTitle,
      attendeeName,
      attendeeEmail,
      ticketNumber,
      eventId,
      organizationId,
      ticketId,
      checkedInDate
    })
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-900 to-black text-white">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Tus Tickets</h1>
          <div className="space-y-8">
            {tickets.map(data => (
              <Card
                key={data.event.id}
                className="group bg-zinc-900/60 border-zinc-800/50 shadow-lg transition hover:bg-zinc-900/80 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3 text-sm text-zinc-400">
                        <time className="text-sm">20:00 · 17:00 GMT-8</time>
                      </div>
                      <h2 className="text-white text-2xl font-semibold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-zinc-300">
                        {data.event.title}
                      </h2>
                      <div className="flex items-center gap-3 mt-2">
                        <Avatar className="w-8 h-8 border border-zinc-800">
                          <AvatarImage src={data.event.organization.logo} />
                        </Avatar>
                        <span className="text-zinc-400">
                          {data.event.organization.name}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Image
                        src={data.event.openGraphImage}
                        alt="Event banner"
                        width={600}
                        height={100}
                        className="relative rounded-xl border border-zinc-800/50 w-full h-60 object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {data.tickets.map((ticket, index) => (
                      <div
                        key={ticket.id}
                        className="flex justify-between items-center border-t border-zinc-800 pt-4"
                      >
                        <div className="flex gap-5">
                          <Badge className="bg-zinc-800/50 border border-zinc-700">
                            Ticket #{index + 1}
                          </Badge>
                          <TicketStatusBadge status={ticket.status} />
                        </div>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-white/5 border-zinc-700 hover:bg-white/10 text-white hover:text-white"
                          onClick={() =>
                            openModal(
                              data.event.title,
                              ticket.registration.customFields.name,
                              ticket.registration.customFields.email,
                              (index + 1).toString(),
                              data.event.id,
                              data.event.organizationId,
                              ticket.id,
                              ticket.checkedInDate
                                ? ticket.checkedInDate.toString()
                                : ''
                            )
                          }
                          disabled={['PENDING', 'REJECTED'].includes(
                            ticket.status
                          )}
                        >
                          <Ticket className="w-4 h-4" />
                          Ver Ticket
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      <QRModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        eventTitle={modalState.eventTitle}
        attendeeName={modalState.attendeeName}
        attendeeEmail={modalState.attendeeEmail}
        ticketNumber={modalState.ticketNumber}
        eventId={modalState.eventId}
        organizationId={modalState.organizationId}
        ticketId={modalState.ticketId}
        checkedInDate={modalState.checkedInDate}
      />
    </>
  )
}

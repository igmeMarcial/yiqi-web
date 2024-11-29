import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { QRCodeSVG } from 'qrcode.react'

interface QRModalProps {
  isOpen: boolean
  onClose: () => void
  eventTitle: string
  attendeeName: string
  attendeeEmail: string
  ticketNumber: string
  eventId: string
  organizationId: string
  ticketId: string
  checkedInDate: string
}

interface TicketInfo {
  label: string
  value: string
}

export function QRModal({
  isOpen,
  onClose,
  eventTitle,
  attendeeName,
  attendeeEmail,
  ticketNumber,
  eventId,
  organizationId,
  ticketId,
  checkedInDate
}: QRModalProps) {
  const qrData = `${process.env.NEXT_PUBLIC_URL}/admin/orgnanizations/${organizationId}/events/${eventId}/checkin/${ticketId}`

  const ticketInfo: TicketInfo[] = [
    { label: 'Ticket #', value: ticketNumber },
    { label: 'Nombre', value: attendeeName },
    { label: 'Correo', value: attendeeEmail },
    { label: 'Estado', value: checkedInDate ? 'Checkeado' : 'No checkeado' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 w-96 p-4 rounded-md pt-10">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-lg">
            {eventTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center p-4 space-y-4">
          <div className="border border-dashed border-zinc-700 p-3 rounded-lg">
            <QRCodeSVG value={qrData} size={160} />
          </div>
          <div className="w-full space-y-2">
            {ticketInfo.map(info => (
              <div className="flex justify-between text-sm" key={info.label}>
                <span className="text-zinc-400">{info.label}</span>
                <span className="text-white">{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { QRCodeSVG } from 'qrcode.react'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('QRModal')
  const qrData = `${process.env.NEXT_PUBLIC_URL}/admin/orgnanizations/${organizationId}/events/${eventId}/checkin/${ticketId}`

  const ticketInfo: TicketInfo[] = [
    { label: t('ticketLabel'), value: ticketNumber },
    { label: t('ticketName'), value: attendeeName },
    { label: t('ticketEmail'), value: attendeeEmail },
    {
      label: t('ticketStatus'),
      value: checkedInDate ? t('ticketChecked') : t('ticketNotChecked')
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 p-4 rounded-md pt-10 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-lg">
            {eventTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center p-4 space-y-4">
          <div className="border border-dashed border-zinc-700 p-3 rounded-lg">
            <QRCodeSVG
              bgColor="#000"
              fgColor="#fff"
              value={qrData}
              size={160}
            />
          </div>
          <div className="w-full space-y-2">
            {ticketInfo.map(info => (
              <div className="flex justify-between text-sm" key={info.label}>
                <span className="text-zinc-400">{info.label}</span>
                <span
                  className={`text-white ${
                    info.label === t('ticketEmail')
                      ? 'truncate max-w-[150px]'
                      : ''
                  }`}
                  title={info.value}
                >
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

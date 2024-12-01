import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SavedTicketOfferingType } from '@/schemas/eventSchema'
import { Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface TicketSelectionProps {
  tickets: SavedTicketOfferingType[]
  ticketSelections: Record<string, number>
  onQuantityChange: (ticketId: string, change: number) => void
  hasSelectedTickets: boolean
  calculateTotal: () => number
}

export function TicketSelection({
  tickets,
  ticketSelections,
  onQuantityChange,
  hasSelectedTickets,
  calculateTotal
}: TicketSelectionProps) {
  const t = useTranslations('RegistrationComponent')
  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <div key={ticket.id} className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-white">{ticket.name}</h4>
              <p className="text-sm text-white/80">{ticket.description}</p>
            </div>
            <div className="text-right text-white">
              {ticket.price === 0
                ? `${t('eventFree')}`
                : `$${ticket.price.toFixed(2)}`}
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onQuantityChange(ticket.id, -1)}
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
              onClick={() => onQuantityChange(ticket.id, 1)}
              disabled={ticketSelections[ticket.id] >= 5}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {hasSelectedTickets && (
        <>
          <Separator className="bg-white/20" />
          <div className="flex justify-between text-white font-medium">
            <span>{t('eventTotal')}</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  )
}

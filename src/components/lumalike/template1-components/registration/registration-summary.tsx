import { translations } from '@/lib/translations/translations'
import { SavedTicketType } from '@/schemas/eventSchema'

interface RegistrationSummaryProps {
  tickets: SavedTicketType[]
  ticketSelections: Record<string, number>
  calculateTotal: () => number
}

export function RegistrationSummary({
  tickets,
  ticketSelections,
  calculateTotal
}: RegistrationSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">
        {translations.es.eventRegistrationSummary}
      </h3>
      <div className="space-y-2">
        {tickets.map(ticket => {
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
}

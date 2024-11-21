'use client'

import { useLanguage } from '@/hooks/useLanguage'
import Link from 'next/link'

interface EventListProps {
  events: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  orgId: string
}

export function EventList({ events, orgId }: EventListProps) {
  const { t } = useLanguage()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('events')}</h1>
        <Link
          href={`/admin/organizations/${orgId}/events/new`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {t('createNewEvents')}
        </Link>
      </div>

      <div>
        {events.map(event => (
          <Link
            href={`/admin/organizations/${orgId}/events/${event.id}`}
            key={event.id}
            className="block p-4 border rounded-md cursor-pointer"
          >
            {event.title} - {new Date(event.startDate).toLocaleString()}
          </Link>
        ))}
      </div>
    </div>
  )
}

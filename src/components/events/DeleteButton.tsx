'use client'
import { deleteEvent } from '@/services/actions/event/deleteEvent'
import { Button } from '@react-email/components'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export function DeleteButton(params: {
  eventId: string
  organizationId: string
}) {
  const router = useRouter()
  const t = useTranslations('Editor')

  async function handleOnDelete() {
    await deleteEvent(params.eventId)
    router.push(`/admin/organizations/${params.organizationId}/events`)
  }

  return (
    <Button
      onClick={handleOnDelete}
      className="text-destructive h-10 px-4 py-2 rounded-md cursor-pointer"
    >
      {t('Delete')}
    </Button>
  )
}

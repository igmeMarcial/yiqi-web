'use server'

import { getUser, isEventAdmin } from '@/lib/auth/lucia'
import {
  sendUserWhatsappMessageProps,
  sendUserWhatsappMessage
} from '@/lib/whatsapp/sendUserWhatsappMessage'

export async function sendUserWhatsappMessageAction(
  props: sendUserWhatsappMessageProps & { eventId?: string | undefined }
) {
  const currentUser = await getUser()
  if (!currentUser) throw new Error('Unauthorized')

  if (props.eventId) {
    const isAllowed = await isEventAdmin(props.eventId, currentUser.id)

    if (!isAllowed) {
      throw new Error('Unauthorized: not allowed to see messages')
    }
  }

  return sendUserWhatsappMessage({ ...props, senderUserId: currentUser.id })
}

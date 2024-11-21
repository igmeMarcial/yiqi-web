'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { MessageForm } from './MessageForm'
import {
  MessageThreadType,
  MessageThreadTypeEnum
} from '@/schemas/messagesSchema'
import { useLanguage } from '@/hooks/useLanguage'

export function BulkSendModal() {
  const { t } = useLanguage()
  const [messageType, setMessageType] = useState<MessageThreadType>(
    MessageThreadTypeEnum.Enum.whatsapp
  )

  const handleBulkSend = async (values: { message: string }) => {
    console.log(t('bulkSendLog'), values.message, messageType)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{t('bulkSendButton')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('bulkSendTitle')}</DialogTitle>
        </DialogHeader>
        <MessageForm
          onSubmit={handleBulkSend}
          messageType={messageType}
          setMessageType={setMessageType}
        />
      </DialogContent>
    </Dialog>
  )
}

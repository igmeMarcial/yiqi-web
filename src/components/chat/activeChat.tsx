'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrgMessageListItemSchemaType } from '@/schemas/messagesSchema'
import { useTranslations } from 'next-intl'
import ChatSelector from './ChatSelector'

export default function ActiveChatComponent({
  chats,
  children,
  activeUserId
}: {
  chats: OrgMessageListItemSchemaType[]
  children: React.ReactNode
  activeUserId: string
}) {
  const t = useTranslations('Chat')

  return (
    <Card className="h-[80vh]">
      <CardContent className="p-0 h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={25} minSize={20}>
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">{t('chats')}</h2>
              </div>
              <ScrollArea className="flex-1">
                <div className="pr-4">
                  {chats.map((chat, index) => (
                    <ChatSelector
                      key={index}
                      {...chat}
                      isActive={chat.contextUserId === activeUserId}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex flex-col h-full items-center justify-center p-6">
              {children}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  )
}

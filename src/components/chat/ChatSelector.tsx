'use client'

import { OrgMessageListItemSchemaType } from '@/schemas/messagesSchema'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ChatSelector({
  contextUserName,
  lastMessage,
  contextUserId,
  contextUserPicture,
  isActive = false
}: OrgMessageListItemSchemaType & { isActive?: boolean }) {
  const orgId = useParams().id
  function getFirst5Words(str: string): string {
    const words = str.split(' ')
    const first5Words = words.slice(0, 5)
    return first5Words.join(' ') + (words.length > 5 ? '...' : '')
  }

  return (
    <Link href={`/admin/organizations/${orgId}/chat/${contextUserId}`}>
      <div className="border-b last:border-b-0">
        <div
          className={`flex flex-row items-start gap-3 p-3 hover:bg-accent ${
            isActive ? 'bg-accent' : ''
          }`}
        >
          <Avatar>
            <AvatarImage src={contextUserPicture ?? ''} alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-1">
            <p className="font-bold">{contextUserName}</p>
            <p className="text-muted-foreground text-sm">
              {getFirst5Words(lastMessage?.content ?? '')}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

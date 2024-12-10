import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import ActiveChatComponent from '@/components/chat/activeChat'
import ConnectedChat from '@/components/chat/connectedChat'
import { getOrganizationMessageThreads } from '@/services/actions/communications/getOrganizationMessageThreads'
import { getUserMessageList } from '@/services/actions/communications/getUserMessageList'
import { BulkSendModal } from '@/components/chat/BulkSendModal'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function Page({
  params
}: {
  params: { id: string; userId: string }
}) {
  const user = await getUser()
  const t = await getTranslations('Chat')

  if (!user) {
    redirect(`/auth`)
  }

  const chats = await getOrganizationMessageThreads(params.id)
  const messages = await getUserMessageList(params.userId, params.id)
  console.log('messages', messages.length)
  console.log('id ', params.id)
  if (user.role === Roles.ADMIN) {
    return (
      <main className="flex flex-col items-center justify-center">
        <OrganizationLayout
          orgId={params.id}
          userProps={{
            picture: user.picture!,
            email: user.email,
            name: user.name,
            id: user.id
          }}
        >
          <div className="border border-gray p-2 sm:p-4 rounded">
            <div className="flex items-center justify-between sm:justify-end pt-4">
              <div className="w-full flex justify-start mb-4 gap-2">
                <Link
                  href={`/admin/organizations/${params.id}/chat`}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-lg font-semibold">{t('chats')}</h1>
              </div>
              <div className="w-full flex justify-end mb-4">
                <BulkSendModal allowedMessageTypes={['email']} />
              </div>
            </div>
            <ActiveChatComponent
              orgId={params.id}
              chats={chats}
              activeUserId={params.userId}
            >
              <ConnectedChat
                defaultMessages={messages}
                userId={params.userId}
                orgId={params.id}
                allowedMessageTypes={['email']}
              />
            </ActiveChatComponent>
          </div>
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/newuser`)
  }
}

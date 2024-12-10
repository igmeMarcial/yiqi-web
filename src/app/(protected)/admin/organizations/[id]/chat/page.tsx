import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import ChatComponent from '@/components/chat/chat'
import { BulkSendModal } from '@/components/chat/BulkSendModal'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'
import { getOrganizationMessageThreads } from '@/services/actions/communications/getOrganizationMessageThreads'
import { getTranslations } from 'next-intl/server'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser()
  const t = await getTranslations('Chat')

  if (!user) {
    redirect(`/auth`)
  }

  const chats = await getOrganizationMessageThreads(params.id)

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
          <div className=" border border-gray p-2 sm:p-4 rounded">
            <div className="flex items-center justify-between sm:justify-end pt-4">
              <div className="w-full flex justify-start mb-4">
                <h1 className="text-lg font-semibold">{t('chats')}</h1>
              </div>
              <div className="w-full flex justify-end mb-4">
                <BulkSendModal allowedMessageTypes={['email']} />
              </div>
            </div>
            <ChatComponent chats={chats} />
          </div>
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/newuser`)
  } else if (user.role == Roles.ANDINO_ADMIN) {
    redirect(`/andino-admin`)
  } else if (user.role === Roles.USER) {
    redirect(`/user`)
  }
}

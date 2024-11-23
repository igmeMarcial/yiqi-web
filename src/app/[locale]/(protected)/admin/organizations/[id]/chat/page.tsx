import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import ChatComponent from '@/components/chat/chat'
import { getOrganizationMessageThreads } from '@/services/actions/messagesActions'
import { BulkSendModal } from '@/components/chat/BulkSendModal'
import OrganizationLayout from '@/components/orgs/OrganizationLayout'

<<<<<<< HEAD
export default async function Page({
  params
}: {
  params: { locale: string; id: string }
}) {
  const { locale } = params
=======
export default async function Page({ params }: { params: {locale:string, id: string } }) {
  const { locale } = params;
>>>>>>> 94ce09a (i18n frontEnd migration)
  const user = await getUser()

  if (!user) {
    redirect(`/${locale}/auth`)
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
          <div className="w-full flex justify-end mb-4">
            <BulkSendModal />
          </div>
          <ChatComponent chats={chats} />
        </OrganizationLayout>
      </main>
    )
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/${locale}/newuser`)
  } else if (user.role == Roles.ANDINO_ADMIN) {
    redirect(`/${locale}/andino-admin`)
  } else if (user.role === Roles.USER) {
    redirect(`/${locale}/user`)
  }
}

import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getUserProfile } from '@/services/actions/userActions'
import UserProfilePage from '@/components/user/UserProfile'
import { translations } from '@/lib/translations/translations'

export default async function Page() {
  const user = await getUser()

  if (!user) {
    redirect('/auth')
  }

  const userInformation = await getUserProfile(user.id)

  if (!userInformation) {
    return <div>{translations.es.userNotFound}</div>
  }

  if (user.role === Roles.USER) {
    return <UserProfilePage user={userInformation} />
  } else if (user.role === Roles.ADMIN) {
    redirect('/admin')
  } else if (user.role === Roles.NEW_USER) {
    redirect('/newuser')
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect('/andino-admin')
  }
}

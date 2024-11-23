import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getAllOrganizationsForCurrentUser } from '@/services/actions/organizationActions'

export default async function Page({
<<<<<<< HEAD
  params
}: {
  params: {
=======
  params,
}: {
  params:{
>>>>>>> 94ce09a (i18n frontEnd migration)
    locale: string
  }
}) {
  const user = await getUser()
<<<<<<< HEAD
  const { locale } = params
=======
  const {locale} = params
>>>>>>> 94ce09a (i18n frontEnd migration)
  if (!user) {
    return redirect(`/${locale}/auth`)
  }
  const orgs = await getAllOrganizationsForCurrentUser()

  if (orgs.length >= 1) {
    redirect(`/${locale}/admin/organizations/${orgs[0].id}`)
  } else if (user.role === Roles.NEW_USER) {
    redirect(`/${locale}/newuser`)
  } else if (user.role === Roles.USER) {
    redirect(`/${locale}/user`)
  } else if (user.role === Roles.ANDINO_ADMIN) {
    redirect(`/${locale}/andino-admin`)
  }

  return <div>Loading...</div>
}

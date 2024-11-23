import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'
import { Roles } from '@prisma/client'
import { getAllOrganizationsForCurrentUser } from '@/services/actions/organizationActions'

export default async function Page({
  params
}: {
  params: {
    locale: string
  }
}) {
  const user = await getUser()
  const { locale } = params
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

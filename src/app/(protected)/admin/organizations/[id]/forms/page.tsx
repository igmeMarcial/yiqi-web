import FormsList from '@/components/yiqiForm/FormResults/FormsList'
import { getUser } from '@/lib/auth/lucia'
import { getForms } from '@/services/actions/typeForm/typeFormActions'
import { Roles } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
export default async function FormsPage({
  params
}: {
  params: { id: string }
}) {
  const user = await getUser()
  const formsResponse = await getForms(params.id)
  if (!formsResponse.success) {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300">
        {formsResponse.error?.message ?? 'Formularios no encontrados'}
      </div>
    )
  }
  if (user) {
    if (user.role === Roles.ADMIN) {
      return (
        <FormsList
          organizationId={params.id}
          forms={formsResponse.forms || []}
        />
      )
    } else if (user.role === Roles.NEW_USER) {
      redirect(`/newuser`)
    } else if (user.role === Roles.USER) {
      redirect(`/user`)
    }
  }
}

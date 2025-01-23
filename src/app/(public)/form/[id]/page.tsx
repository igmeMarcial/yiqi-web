import Publish from '@/components/yiqiForm/publish/Publish'
import { getUser } from '@/lib/auth/lucia'
import { getTypeForm } from '@/services/actions/typeForm/typeFormActions'
import React from 'react'

type Props = {
  params: { id: string }
}
async function page({ params }: Props) {
  const user = await getUser()
  const formResponse = await getTypeForm(params.id)

  if (!formResponse.success || !formResponse.form) {
    return (
      <div>
        <h1>No hay formulario</h1>
        <p>
          {formResponse.error?.message ?? 'El formulario solicitado no existe.'}
        </p>
      </div>
    )
  }

  return <Publish form={formResponse.form} user={user} />
}

export default page

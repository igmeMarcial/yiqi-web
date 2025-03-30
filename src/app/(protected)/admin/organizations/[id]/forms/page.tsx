import React from 'react'
import FormsList from '@/components/yiqiForm/FormResults/FormsList'
import { getForms } from '@/services/actions/typeForm/typeFormActions'
import { getTranslations } from 'next-intl/server'

export default async function FormsPage({
  params
}: {
  params: { id: string }
}) {
  const formsResponse = await getForms(params.id)
  const t = await getTranslations('Sidebar')
  if (!formsResponse.success) {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300">
        {formsResponse.error?.message ?? 'Formularios no encontrados'}
      </div>
    )
  }

  return (
    <section className="w-full h-screen sm:p-4 rounded-lg sm:border text-card-foreground shadow-sm bg-primary">
      <div className="flex w-full justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">{t('forms')}</h1>
      </div>
      <FormsList organizationId={params.id} forms={formsResponse.forms || []} />
    </section>
  )
}

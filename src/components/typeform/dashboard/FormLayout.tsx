'use client'

import React from 'react'
import { FormHeader } from './FormHeader'
import { FormField } from '../types/yiqiFormTypes'

function FormLayout({
  children,
  form,
  orgId
}: {
  children: React.ReactNode
  form: FormField[]
  orgId: string
}) {
  return (
    <div className="max-h-screen flex flex-col">
      <FormHeader form={form} orgId={orgId} />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export default FormLayout

'use client'

import FormLayout from '@/components/typeform/dashboard/FormLayout'
import { ThemeProvider } from '@/components/typeform/dashboard/theme-provider'
import { WorkArea } from '@/components/typeform/dashboard/WorkArea'
import { FormField } from '@/components/typeform/types/yiqiFormTypes'
import React, { useCallback, useMemo, useState } from 'react'

function YiqiForm({ orgId }: { orgId: string }) {
  const [form, setForm] = useState<FormField[]>([])
  const addField = useCallback((field: FormField) => {
    setForm(prevForm => [...prevForm, field])
  }, [])
  const updateField = useCallback(
    (id: string, updatedField: Partial<FormField>) => {
      setForm(prevForm =>
        prevForm.map(field =>
          field.id === id ? { ...field, ...updatedField } : field
        )
      )
    },
    []
  )

  const removeField = useCallback((id: string) => {
    setForm(prevForm => prevForm.filter(field => field.id !== id))
  }, [])

  const reorderFields = useCallback((newOrder: FormField[]) => {
    setForm(newOrder)
  }, [])

  const workAreaProps = useMemo(
    () => ({
      form,
      addField,
      updateField,
      removeField,
      reorderFields
    }),
    [form, addField, updateField, removeField, reorderFields]
  )
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <FormLayout form={form} orgId={orgId}>
        <WorkArea {...workAreaProps} />
      </FormLayout>
    </ThemeProvider>
  )
}

export default YiqiForm

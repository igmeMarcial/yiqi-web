import FormManager from '@/components/yiqiForm/FormManager'
import React from 'react'

async function page({ params }: { params: { id: string } }) {
  return (
    <FormManager orgId={params.id} formResponse={null} submissions={null} />
  )
}

export default page

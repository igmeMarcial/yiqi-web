'use client'
import { Button } from '@/components/ui/button'
import { SendHorizonal } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { createTypeForm } from '@/services/actions/typeForm/typeFormActions'
import { generateUniqueId } from '../utils'
import { Form, FormField } from '../types/yiqiFormTypes'
import { useState } from 'react'
import { EditFormDetailsModal } from './EditFormDetailsModal'
import { PublishSuccessModal } from './PublishSuccessModal'
import { useToast } from '@/hooks/use-toast'
import { translations } from '@/lib/translations/translations'

export function FormHeader({
  form,
  orgId
}: {
  form: FormField[]
  orgId: string
}) {
  const [formDetails, setFormDetails] = useState({
    name: translations.es.newFormName,
    description: translations.es.newFormDescription
  })
  const navigationItems = [
    {
      title: 'Crear',
      path: `/admin/organizations/${orgId}/forms`,
      disabled: false
    },
    {
      title: 'Results',
      path: `/admin/organizations/${orgId}/forms/results`,
      disabled: true
    }
  ] as const
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [publishedFormUrl, setPublishedFormUrl] = useState('')
  const { toast } = useToast()
  const handlePublish = async () => {
    if (form.length === 0) {
      toast({
        title: 'Error',
        description: 'The form must have at least one field before publishing.',
        variant: 'destructive'
      })
      return
    }
    try {
      const formToSubmit: Form = {
        id: generateUniqueId(),
        name: formDetails.name,
        description: formDetails.description,
        fields: form,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const response = await createTypeForm(orgId, formToSubmit)
      if (response.success) {
        setPublishedFormUrl(
          `${process.env.NEXT_PUBLIC_URL}/form/${formToSubmit.id}`
        )
        setIsPublishModalOpen(true)

        toast({
          title: `${translations.es.publishSuccessTitle}`,
          description: `${translations.es.publishSuccessDescription.replace('{formName}', formToSubmit.name)}`,
          variant: 'default'
        })
      } else {
        toast({
          title: `${translations.es.publishErrorTitle}`,
          description: `${translations.es.publishErrorDescription}`,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: `${translations.es.formErrorTitle}`,
        description: `${translations.es.formErrorDescription}`,
        variant: 'destructive'
      })
      console.error('Form publish error:', error)
    }
  }
  return (
    <>
      <header className="border-b">
        <div className="flex h-14 items-center px-4 pr-8 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium md:text-base md:font-semibold lg:text-lg lg:font-bold">
              {translations.es.formHeader}
            </span>
            <span className="text-muted-foreground">/</span>
            <EditFormDetailsModal
              formName={formDetails.name}
              formDescription={formDetails.description}
              onSave={(name, description) =>
                setFormDetails({ name, description })
              }
            />
          </div>
          <NavigationMenu className="mx-auto hidden sm:flex">
            <NavigationMenuList className="gap-6">
              {navigationItems.map(({ title, path, disabled }) => (
                <NavigationMenuItem key={path}>
                  {disabled ? (
                    <span className="text-gray-400 cursor-not-allowed">
                      {title}
                    </span>
                  ) : (
                    <Link href={path} legacyBehavior passHref>
                      <NavigationMenuLink>{title}</NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handlePublish}
            >
              <SendHorizonal className="h-4 w-4" />
              {translations.es.publish}
            </Button>
          </div>
        </div>
      </header>
      <PublishSuccessModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        formUrl={publishedFormUrl}
      />
    </>
  )
}

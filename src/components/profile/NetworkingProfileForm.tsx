'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '../ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { saveNetworkingProfile } from '@/services/actions/user/saveNetworkingProfile'
import { translations } from '@/lib/translations/translations'
import { Loader2, Save } from 'lucide-react'
import { userDataCollectedShema } from '@/schemas/userSchema'
import type { UserDataCollected } from '@/schemas/userSchema'

type Props = {
  initialData?: Partial<UserDataCollected>
}

export default function NetworkingProfileForm({ initialData = {} }: Props) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UserDataCollected>({
    resolver: zodResolver(userDataCollectedShema),
    defaultValues: {
      professionalMotivations: initialData.professionalMotivations ?? '',
      communicationStyle: initialData.communicationStyle ?? '',
      professionalValues: initialData.professionalValues ?? '',
      careerAspirations: initialData.careerAspirations ?? '',
      significantChallenge: initialData.significantChallenge ?? ''
    }
  })

  async function onSubmit(data: UserDataCollected) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = await saveNetworkingProfile(formData)
      if (result.success) {
        toast({
          title: translations.es.networkingProfileSaved
        })
      } else {
        toast({
          title: translations.es.networkingProfileError,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: translations.es.networkingProfileError,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{translations.es.networkingProfileTitle}</CardTitle>
        <CardDescription className="space-y-3">
          {translations.es.networkingProfileDescription}
        </CardDescription>
        <CardDescription>{translations.es.networkingBenefits}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="professionalMotivations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translations.es.professionalMotivationsLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        translations.es.professionalMotivationsPlaceholder
                      }
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="communicationStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translations.es.communicationStyleLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        translations.es.communicationStylePlaceholder
                      }
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professionalValues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translations.es.professionalValuesLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        translations.es.professionalValuesPlaceholder
                      }
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careerAspirations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translations.es.careerAspirationsLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={translations.es.careerAspirationsPlaceholder}
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="significantChallenge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {translations.es.significantChallengeLabel}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        translations.es.significantChallengePlaceholder
                      }
                      className="min-h-[100px]"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  <span>{translations.es.saveNetworkingProfile}</span>
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'

// Define the Zod schema
const formSchema = z.object({
  name: z.string().min(1, { message: 'Necesitamos tu nombre' }),
  phone: z.string().min(1, { message: '¿Cuál es tu teléfono?' }),
  email: z.string().email({ message: 'Tu email es inválido' }),
  linkedin: z.string().url({ message: 'Tu link es inválido' })
})

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      linkedin: ''
    }
  })

  const { toast } = useToast()
  const t = useTranslations('Bootcamp')

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // get to add the server action to create the lead based on org id
      toast({
        title: `${t('thanksForApplying')}`,
        description: `${values}`
      })
    } catch (error) {
      toast({
        description: `${error}`,
        variant: 'destructive'
      })
    } finally {
      await form.reset()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="backdrop-blur-lg border bg-black rounded-[22px] bg-opacity-20 p-4"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Name')}</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} />
              </FormControl>
              <FormDescription className="text-white">
                {t('enterFullName')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Phone')}</FormLabel>
              <FormControl>
                <Input placeholder={t('yourNumber')} {...field} />
              </FormControl>
              <FormDescription className="text-white">
                {t('enterNumber')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Email')}</FormLabel>
              <FormControl>
                <Input placeholder={t('yourEmail')} {...field} />
              </FormControl>
              <FormDescription className="text-white">
                {t('contact')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* LinkedIn Field */}
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input placeholder="Tu perfil de LinkedIn" {...field} />
              </FormControl>
              <FormDescription className="text-white">
                {t('linkedInUrl')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant={'secondary'} className="w-full mt-2" type="submit">
          {t('apply')}
        </Button>
      </form>
    </Form>
  )
}

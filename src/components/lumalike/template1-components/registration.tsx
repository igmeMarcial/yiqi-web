/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
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
import { translations } from '@/lib/translations/translations'

const formSchema = z.object({
  name: z.string().min(2, {
    message: translations.es.eventFormNameError
  }),
  email: z.string().email({
    message: translations.es.eventFormEmailError
  })
})

type Props = {
  eventId: string
}

export function Registration({ eventId }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This is where you would handle the form submission
    console.log(values)
  }

  return (
    <Dialog>
      <Card className="bg-primary-foreground/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="rounded-full bg-primary/10 p-2">
              <Calendar className="h-6 w-6 text-primary text-white" />
            </div>
            <div>
              <div className="font-semibold text-lg mb-1 text-white">
                {translations.es.eventApprovalRequired}
              </div>
              <p className="text-sm text-muted-foreground text-white">
                {translations.es.eventApprovalDescription}
              </p>
            </div>
          </div>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full text-white">
              {translations.es.eventRequestToJoin}
            </Button>
          </DialogTrigger>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {translations.es.eventRegistration}
          </DialogTitle>
          <DialogDescription>
            {translations.es.eventRegistrationDescription}
          </DialogDescription>
        </DialogHeader>
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.es.eventFormName}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translations.es.eventFormNamePlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {translations.es.eventFormNameDescription}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.es.eventFormEmail}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={translations.es.eventFormEmailPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {translations.es.eventFormEmailDescription}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{translations.es.eventFormSubmit}</Button>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

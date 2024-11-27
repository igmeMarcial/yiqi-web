import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { translations } from '@/lib/translations/translations'
import { UseFormReturn } from 'react-hook-form'
import { RegistrationInput } from '@/schemas/eventSchema'

interface RegistrationFormProps {
  form: UseFormReturn<RegistrationInput>
  onSubmit: (values: RegistrationInput) => Promise<void>
  user: {
    email: string | undefined
    name: string | undefined
  }
  isFreeEvent: boolean
}

export function RegistrationForm({
  form,
  onSubmit,
  user,
  isFreeEvent
}: RegistrationFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                disabled={!!user}
                className={user ? 'bg-muted' : ''}
              />
            </FormControl>
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
                disabled={!!user}
                className={user ? 'bg-muted' : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full">
        {isFreeEvent
          ? translations.es.eventConfirmRegistration
          : translations.es.eventConfirmPurchase}
      </Button>
    </form>
  )
}

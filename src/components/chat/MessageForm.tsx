import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import {
  MessageThreadType,
  MessageThreadTypeEnum
} from '@/schemas/messagesSchema'
import { translations } from '@/lib/translations/translations'
import { useTranslations } from 'next-intl'

const formSchema = z.object({
  message: z.string().min(1, {
    message: translations.es.messageMinLength
  })
})

interface MessageFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
  messageType: MessageThreadType
  setMessageType: (type: MessageThreadType) => void
}

export function MessageForm({
  onSubmit,
  messageType,
  setMessageType
}: MessageFormProps) {
  const t = useTranslations("BulkSend")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ''
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={t("typeYourMessage")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {messageType === MessageThreadTypeEnum.Enum.whatsapp
                  ? `${t('whatsapp')}`
                  : `${t("email")}`}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  setMessageType(MessageThreadTypeEnum.Enum.whatsapp)
                }
              >
                {t("whatsapp")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setMessageType(MessageThreadTypeEnum.Enum.email)}
              >
                {t("email")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="submit">
            {t("send")}{' '}
            {messageType === MessageThreadTypeEnum.Enum.whatsapp
              ? `${t("whatsapp")}`
              : `${t("email")}`}
          </Button>
        </div>
      </form>
    </Form>
  )
}

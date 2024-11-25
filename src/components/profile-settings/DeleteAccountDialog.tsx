'use client'
import { useCallback, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { TriangleAlert } from 'lucide-react'

import { useRouter } from 'next/navigation'
import { deleteUserAccount } from '@/services/actions/userActions'
import { useLocale, useTranslations } from 'next-intl'

export default function DeleteAccountDialog() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const t = useTranslations("DeleteAccount")
  const localActive = useLocale()

  const handleDelete = useCallback(async () => {
    try {
      setIsLoading(true)
      const result = await deleteUserAccount()
      if (result.success) {
        toast({
          title: `${t("accountDeleted")}`,
          description: `${t("accountDeletedDescription")}`
        })
        router.push(`/${localActive}/auth`)
      } else {
        toast({
          title: `${t("error")}`,
          description: result.error ?? `${t("errorDeleting")}`,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: `${t("error")}`,
        description: `${t("somethingWentWrong")}`,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, toast])

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center space-x-2">
          <TriangleAlert className="h-4 w-4" />
          <span>{t("deleteAccount")}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("actionCannotBeUndone")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading
              ? `${t("deleting")}`
              : `${t("deleteAccountConfirmation")}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

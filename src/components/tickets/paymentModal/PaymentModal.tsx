import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { translations } from '@/lib/translations/translations'

interface PaymentModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
}

export const PaymentModal = ({
  isOpen,
  onOpenChange,
  eventId
}: PaymentModalProps) => {
  const router = useRouter()

  const paymentUrl = `${process.env.NEXT_PUBLIC_URL}/${eventId}`

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 p-4 rounded-md pt-10 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-lg">
            {translations.es.ticketPaymentRequired}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center p-4 space-y-4">
          <p className="text-zinc-400 text-center">
            {translations.es.ticketPaymentInstruction}
          </p>
          <div className="w-full space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(paymentUrl)}
            >
              {translations.es.ticketPayment}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { motion } from 'framer-motion'
import { UserPlus, TicketIcon, PartyPopper } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  userDataCollectedShema,
  type LuciaUserType
} from '@/schemas/userSchema'
import { Button } from '@/components/ui/button'
import { SavedEventType } from '@/schemas/eventSchema'
import { NetworkingMatchesType } from '@/schemas/networkingMatchSchema'
import { useTranslations } from 'next-intl'

function RenderMatchmakingInfo({
  eventId,
  isUserCheckedInOngoingEvent,
  user
}: {
  eventId: string
  isUserCheckedInOngoingEvent: boolean
  networkingMatches: NetworkingMatchesType | null
  user?: LuciaUserType
}): JSX.Element | null {
  const router = useRouter()
  const t = useTranslations('EventManageMatchmaking')

  if (!user) return null

  const validData = user.dataCollected ?? {}
  const userData = userDataCollectedShema.parse(validData)

  const isProfileComplete =
    userData.professionalMotivations &&
    userData.communicationStyle &&
    userData.professionalValues &&
    userData.careerAspirations &&
    userData.significantChallenge

  const getDescriptionLabel = (
    isProfileComplete: boolean,
    isUserCheckedInOngoingEvent: boolean
  ) => {
    if (!isProfileComplete) return t('missingProfile')
    if (!isUserCheckedInOngoingEvent) return t(`missingCheckIn`)
    return t(`readyForAIMatching`)
  }

  const getActionButton = (
    isProfileComplete: boolean,
    isUserCheckedInOngoingEvent: boolean
  ) => {
    if (!isProfileComplete)
      return (
        <span className="flex items-center justify-center">
          <UserPlus className="mr-2 h-4 w-4 flex-shrink-0" />
          {t('completeProfile')}
        </span>
      )
    if (!isUserCheckedInOngoingEvent)
      return (
        <span className="flex items-center justify-center">
          <TicketIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          {t('viewTickets')}
        </span>
      )
    return (
      <span className="flex items-center justify-center">
        <PartyPopper className="mr-2 h-4 w-4 flex-shrink-0" />
        {t(`viewMatches`)}
      </span>
    )
  }

  const getLink = (
    isProfileComplete: boolean,
    isUserCheckedInOngoingEvent: boolean
  ) => {
    if (!isProfileComplete) return '/user/networking-settings'
    if (!isUserCheckedInOngoingEvent) return `/user/tickets`
    return `/${eventId}/networking`
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="p-6 bg-gradient-to-br from-[#6de4e8]/15 to-[#6de4e8]/5 rounded-xl backdrop-blur-lg border border-[#6de4e8]/30 shadow-lg shadow-[#6de4e8]/10 hover:shadow-[#6de4e8]/20 transition-shadow"
      >
        <p className="text-sm md:text-base text-[#6de4e8] mb-4 font-semibold text-center md:text-left">
          {getDescriptionLabel(
            !!isProfileComplete,
            isUserCheckedInOngoingEvent
          )}
        </p>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            router.push(
              getLink(!!isProfileComplete, isUserCheckedInOngoingEvent)
            )
          }}
          className="w-full md:w-auto bg-[#6de4e8]/10 hover:bg-[#6de4e8]/20 text-[#6de4e8] hover:text-[#6de4e8]/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
        >
          {getActionButton(!!isProfileComplete, isUserCheckedInOngoingEvent)}
        </Button>
      </motion.div>
    </div>
  )
}

export const ManageMatchmaking = ({
  event,
  isUserCheckedInOngoingEvent,
  networkingMatches,
  user
}: {
  event: SavedEventType
  isUserCheckedInOngoingEvent: boolean
  networkingMatches: NetworkingMatchesType | null
  user?: LuciaUserType
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <RenderMatchmakingInfo
        eventId={event.id}
        user={user}
        isUserCheckedInOngoingEvent={isUserCheckedInOngoingEvent}
        networkingMatches={networkingMatches}
      />
    </div>
  )
}

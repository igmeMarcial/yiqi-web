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
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader
} from '@/components/ui/dialog'
import Image from 'next/image'

function RenderMatchmakingInfo({
  eventId,
  isUserCheckedInOngoingEvent,
  networkingMatches,
  user
}: {
  eventId: string
  isUserCheckedInOngoingEvent: boolean
  networkingMatches: NetworkingMatchesType | null
  user?: LuciaUserType
}): JSX.Element | null {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    if (!isProfileComplete)
      return 'Complete Your Profile for AI-Powered Matchmaking'
    if (!isUserCheckedInOngoingEvent)
      return 'Check In to View Your Networking Matches'
    return 'Your AI-Curated Networking Matches Are Ready!'
  }

  const getActionButton = (
    isProfileComplete: boolean,
    isUserCheckedInOngoingEvent: boolean
  ) => {
    if (!isProfileComplete)
      return (
        <span className="flex items-center justify-center">
          <UserPlus className="mr-2 h-4 w-4 flex-shrink-0" />
          Complete Profile
        </span>
      )
    if (!isUserCheckedInOngoingEvent)
      return (
        <span className="flex items-center justify-center">
          <TicketIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          View Tickets
        </span>
      )
    return (
      <span className="flex items-center justify-center">
        <PartyPopper className="mr-2 h-4 w-4 flex-shrink-0" />
        View Matches
      </span>
    )
  }

  const getLink = (
    isProfileComplete: boolean,
    isUserCheckedInOngoingEvent: boolean
  ) => {
    if (!isProfileComplete) return '/user/networking-settings'
    if (!isUserCheckedInOngoingEvent) return `/user/tickets`
    return `/${eventId}`
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
            if (!!isProfileComplete && isUserCheckedInOngoingEvent)
              setIsDialogOpen(true)
            else
              router.push(
                getLink(!!isProfileComplete, isUserCheckedInOngoingEvent)
              )
          }}
          className="w-full md:w-auto bg-[#6de4e8]/10 hover:bg-[#6de4e8]/20 text-[#6de4e8] hover:text-[#6de4e8]/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
        >
          {getActionButton(!!isProfileComplete, isUserCheckedInOngoingEvent)}
        </Button>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center mb-4 text-[#6de4e8]">
              Your Networking Matches
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              AI-curated connections based on your profile and preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {networkingMatches?.length ? (
              networkingMatches.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-gray-800/60 backdrop-blur-sm border border-gray-700"
                >
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex-shrink-0">
                      {item.user.picture ? (
                        <Image
                          src={item.user.picture}
                          width={96}
                          height={96}
                          alt="Profile image"
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-[#6de4e8]"
                        />
                      ) : (
                        <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-[#6de4e8] rounded-full flex items-center justify-center bg-gray-700">
                          <span className="text-2xl md:text-3xl font-bold text-[#6de4e8] uppercase">
                            {item.user.name?.[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 flex-1">
                      <h3 className="text-xl font-semibold text-white capitalize">
                        {item.user.name}
                      </h3>

                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-semibold text-[#6de4e8] mb-1">
                            Why You Should Connect:
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {item.matchReason}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-[#6de4e8] mb-1">
                            About This Match:
                          </h4>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {item.matchReason}{' '}
                            {/* Assuming this should be different content? */}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No matches found. Check back later!
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
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

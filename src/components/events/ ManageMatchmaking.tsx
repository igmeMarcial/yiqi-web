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
  DialogTitle
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
      return 'Completa tu perfil para el Matchmaking impulsado por IA'
    if (!isUserCheckedInOngoingEvent)
      return 'Haz checkin para ver tu Matchmaking '
  }

  const getActionButton = (
    isProfileComplete: boolean,
    isUserCheckedInOngoingEvent: boolean
  ) => {
    if (!isProfileComplete)
      return (
        <>
          <UserPlus className="mr-2 h-4 w-4" /> Ir a mi perfil
        </>
      )
    if (!isUserCheckedInOngoingEvent)
      return (
        <>
          <TicketIcon className="mr-2 h-4 w-4" /> Ir a mis tickets
        </>
      )
    return (
      <>
        <PartyPopper className="mr-2 h-4 w-4" /> Mostrar Networking Matches
      </>
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
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="p-4 bg-[#6de4e8]/20 rounded-lg backdrop-blur-sm border border-[#6de4e8]/30"
      >
        <p className="text-sm text-[#6de4e8] mb-2 font-medium">
          {getDescriptionLabel(
            !!isProfileComplete,
            isUserCheckedInOngoingEvent
          )}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (!!isProfileComplete && isUserCheckedInOngoingEvent)
              setIsDialogOpen(true)
            else
              router.push(
                getLink(!!isProfileComplete, isUserCheckedInOngoingEvent)
              )
          }}
          className="w-full sm:w-auto bg-[#6de4e8]/10 hover:bg-[#6de4e8]/20 text-[#6de4e8]"
        >
          {getActionButton(!!isProfileComplete, isUserCheckedInOngoingEvent)}
        </Button>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80%]">
          <DialogTitle className="text-center">Networking Matches</DialogTitle>
          <DialogDescription>
            <div>
              {networkingMatches && networkingMatches.length ? (
                <div className="space-y-4">
                  {networkingMatches.map(item => {
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg space-y-3 bg-gray-600 bg-opacity-40"
                      >
                        <div className="flex items-center space-x-3">
                          {item.user.picture ? (
                            <Image
                              src={item.user.picture}
                              width={80}
                              height={80}
                              alt="user-image"
                              className="w-12 h-12 rounded-full flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12  border border-white rounded-full flex items-center justify-center">
                              <div className="uppercase text-xl text-white">
                                {item.user.name?.[0]}
                              </div>
                            </div>
                          )}
                          <div className="font-bold text-white capitalize">
                            {item.user.name}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="font-bold text-white">
                              ¿Por qué deberíamos conocernos?
                            </div>
                            <div>{item.matchReason}</div>
                          </div>
                          <div>
                            <div className="font-bold text-white">
                              Acerca de:
                            </div>
                            <div>{item.matchReason}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div>No se econtraron resultados</div>
              )}
            </div>
          </DialogDescription>
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
    <div>
      <div className="space-y-3">
        {/* Matchmaking Info */}
        <RenderMatchmakingInfo
          eventId={event.id}
          user={user}
          isUserCheckedInOngoingEvent={isUserCheckedInOngoingEvent}
          networkingMatches={networkingMatches}
        />
      </div>
    </div>
  )
}

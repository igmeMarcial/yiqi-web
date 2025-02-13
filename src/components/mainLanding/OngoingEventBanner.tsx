'use client'

import { motion } from 'framer-motion'
import {
  LinkIcon,
  Ticket,
  UserPlus,
  TicketIcon,
  MapPin,
  Calendar,
  PartyPopper,
  Dot
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { EventTypeEnum, type SavedEventType } from '@/schemas/eventSchema'
import {
  userDataCollectedShema,
  type LuciaUserType
} from '@/schemas/userSchema'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TooltipProvider } from '@/components/ui/tooltip'
import { formatRangeDatesByTimezoneLabel } from '../utils'

interface OngoingEventBannerProps {
  event: SavedEventType
  isUserCheckedInOngoingEvent: boolean
  user?: LuciaUserType
}

export function RenderMatchmakingInfo({
  eventId,
  isUserCheckedInOngoingEvent,
  user
}: {
  eventId: string
  isUserCheckedInOngoingEvent: boolean
  user?: LuciaUserType
}): JSX.Element | null {
  const router = useRouter()
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
    return 'Ir a evento para ver mi Matchmaking'
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
        <PartyPopper className="mr-2 h-4 w-4" /> Ir al evento
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="xl:flex-grow p-4 bg-[#6de4e8]/20 rounded-lg backdrop-blur-sm border border-[#6de4e8]/30"
    >
      <p className="text-sm text-[#6de4e8] mb-2 font-medium">
        {getDescriptionLabel(!!isProfileComplete, isUserCheckedInOngoingEvent)}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          router.push(getLink(!!isProfileComplete, isUserCheckedInOngoingEvent))
        }
        className="w-full sm:w-auto bg-[#6de4e8]/10 hover:bg-[#6de4e8]/20 text-[#6de4e8]"
      >
        {getActionButton(!!isProfileComplete, isUserCheckedInOngoingEvent)}
      </Button>
    </motion.div>
  )
}

export function OngoingEventBanner({
  event,
  user,
  isUserCheckedInOngoingEvent
}: OngoingEventBannerProps): JSX.Element {
  const {
    id,
    title,
    openGraphImage,
    startDate,
    location,
    virtualLink,
    type,
    timezoneLabel
  } = event
  const isOnlineEvent = type === EventTypeEnum.ONLINE
  const router = useRouter()

  function handleButtonClick(): void {
    if (!user) {
      router.push(`/${id}`)
      return
    }

    if (isOnlineEvent) {
      if (virtualLink) {
        window.open(virtualLink, '_blank')
      } else {
        toast({
          title: 'Error',
          description: 'El enlace no está disponible',
          variant: 'destructive'
        })
      }
    } else {
      router.push('/user/tickets')
    }
  }

  const isEventOnGoing = (startDate: Date) =>
    new Date().getTime() >= startDate.getTime()

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto px-4 mb-6 sm:mb-8"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-black via-[#0a1a1c] to-[#093438] border-[#6de4e8]/30 hover:border-[#6de4e8]/50 transition-all duration-300 group">
          <CardContent className="p-4 lg:p-6">
            <div className="space-y-4 lg:flex lg:space-y-0 lg:space-x-4">
              {/* Image Section */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full lg:w-[350px] h-[250px] aspect-video relative rounded-xl overflow-hidden flex-shrink-0 shadow-lg"
              >
                <Image
                  src={openGraphImage || '/placeholder-event.jpg'}
                  alt={title || 'evento en curso'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
                <Badge className="absolute top-3 left-3 right-3 sm:right-auto bg-black/80 backdrop-blur-sm text-[#6de4e8] font-medium px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatRangeDatesByTimezoneLabel(startDate, timezoneLabel)}
                </Badge>
              </motion.div>

              {/* Content Section */}
              <div className="space-y-2 lg:flex-grow">
                {/* Event Status */}
                <Badge className="bg-[#6de4e8]/20 text-[#6de4e8] hover:bg-[#6de4e8]/30 px-3 py-1 rounded-md">
                  <Dot className="w-6 h-6 -ml-1.5 text-[#6de4e8] animate-pulse" />
                  {isEventOnGoing(startDate)
                    ? 'Evento en curso'
                    : 'Proximo a empezar'}
                </Badge>

                {/* Event Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight line-clamp-2">
                  {title}
                </h3>

                {/* Location */}
                {location && (
                  <div className="flex items-center text-[#6de4e8]/80">
                    <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-lg">{location}</span>
                  </div>
                )}

                <div className="space-y-3 xl:space-y-0 xl:flex xl:items-center xl:gap-x-4">
                  {/* Matchmaking Info */}
                  <RenderMatchmakingInfo
                    eventId={event.id}
                    user={user}
                    isUserCheckedInOngoingEvent={isUserCheckedInOngoingEvent}
                  />

                  {/* Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleButtonClick}
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black font-bold hover:from-[#6de4e8] hover:to-[#04F1FF] transition-all shadow-lg hover:shadow-xl hover:shadow-[#6de4e8]/30"
                    >
                      {isOnlineEvent ? (
                        <>
                          <LinkIcon className="mr-2 h-5 w-5" />
                          Unirse al evento
                        </>
                      ) : (
                        <>
                          <Ticket className="mr-2 h-5 w-5" />
                          Ver ticket
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  )
}

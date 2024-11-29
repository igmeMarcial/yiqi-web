'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { HeroImage } from './template1-components/hero-image'
import { EventDetails } from './template1-components/event-details'
import { Registration } from './template1-components/registration'
import { Hosts } from './template1-components/hosts'
import { EventDescription } from './template1-components/event-description'
import { RegistrationProps } from './template1-components/registration'
import { EventLocation } from './template1-components/event-location'
import MainLandingNav from '../mainLanding/mainNav'
import { translations } from '@/lib/translations/translations'

export function EventPage({ event, user }: RegistrationProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const registrationRef = useRef<HTMLDivElement>(null)
  const dialogTriggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // Asegúrate de usar el tamaño correcto para móviles
    }
    checkMobile()

    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Detectar el scroll y si hemos pasado el contenedor de Registration
  useEffect(() => {
    const handleScroll = () => {
      if (registrationRef.current) {
        const rect = registrationRef.current.getBoundingClientRect()
        if (rect.top <= 0) {
          setIsSticky(true) // Si se ha desplazado más allá de la parte superior, hacerlo sticky
        } else {
          setIsSticky(false) // Si no, quitar la clase sticky
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  console.log(isSticky)

  return (
    <>
      <MainLandingNav
        user={user}
        showExtraButton={isSticky}
        buttonName={translations.es.eventRegister}
        dialogTriggerRef={dialogTriggerRef}
      />
      <div
        style={
          event.backgroundColor
            ? { backgroundColor: event.backgroundColor }
            : {}
        }
        className="fixed inset-0 h-screen w-screen -z-10 bg-black"
      />
      <main className="container mx-auto px-4 py-12 text-primary-foreground pt-16 bg-black">
        <div className="mt-6">
          <motion.div
            className={`space-y-12 flex flex-col sm:flex-row gap-12 ${isMobile ? 'opacity-100 transform-none px-5' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {event.openGraphImage && (
              <HeroImage src={event.openGraphImage} alt={event.title} />
            )}

            <div className="flex flex-col gap-8 w-full">
              <EventDetails event={event} />
              <hr className="my-6 border-t border-solid border-white-opacity-40 w-[100%] ml-0 mx-auto" />
              <motion.div
                ref={registrationRef} // Referencia al contenedor de Registration
                className={`space-y-12 ${isMobile ? 'flex-col' : 'lg:top-24 lg:self-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Registration
                  event={event}
                  user={user}
                  dialogTriggerRef={dialogTriggerRef}
                />
                {event.hosts && <Hosts hosts={event.hosts} />}
              </motion.div>
              <EventDescription description={event.description || ''} />
              <EventLocation location="San Juan de Lurigancho" />
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}

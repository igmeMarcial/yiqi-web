'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeroImage } from './template1-components/hero-image'
import { EventDetails } from './template1-components/event-details'
import { Registration } from './template1-components/registration'
import { Hosts } from './template1-components/hosts'
import { EventDescription } from './template1-components/event-description'
import { RegistrationProps } from './template1-components/registration'

export function EventPage({ event, user }: RegistrationProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      <div
        style={
          event.backgroundColor
            ? { backgroundColor: event.backgroundColor }
            : {}
        }
        className="fixed inset-0 h-screen w-screen -z-10 bg-black"
      />
      <main className="container mx-auto px-4 py-12 text-primary-foreground pt-16 bg-black">
        <div className="grid gap-12 lg:grid-cols-[1fr,400px]">
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {event.openGraphImage && (
              <HeroImage src={event.openGraphImage} alt={event.title} />
            )}
            <EventDetails event={event} />
            <EventDescription description={event.description || ''} />
          </motion.div>
          <motion.div
            className={`space-y-12 ${
              isMobile ? '' : 'lg:sticky lg:top-24 lg:self-start'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Registration event={event} user={user} />
            {event.hosts && <Hosts hosts={event.hosts} />}
          </motion.div>
        </div>
      </main>
    </>
  )
}

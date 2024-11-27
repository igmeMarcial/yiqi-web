import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface EventDetailsProps {
  title: string
  subtitle: string
  date: string
  startTime: string
  endTime: string
  location: string
  city: string
  featuredIn?: {
    name: string
    url: string
  }
}

export function EventDetails({
  title,
  subtitle,
  date,
  startTime,
  endTime,
  location,
  city,
  featuredIn
}: EventDetailsProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {featuredIn && (
        <Badge variant="secondary" className="text-xs px-2 py-1">
          Featured in{' '}
          <Link
            href={featuredIn.url}
            className="font-medium hover:underline ml-1"
          >
            {featuredIn.name}
          </Link>
        </Badge>
      )}
      <h1 className="text-3xl md:text-4xl font-bold leading-tight">{title}</h1>
      <p className="text-lg md:text-xl text-primary-foreground/80">
        {subtitle}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary-foreground/60" />
          <time>
            {date}, {startTime} - {endTime}
          </time>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-foreground/60" />
          <address className="not-italic">
            {location}, {city}
          </address>
        </div>
      </div>
    </motion.div>
  )
}

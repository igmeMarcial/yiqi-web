'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { NetworkingMatchesType } from '@/schemas/networkingMatchSchema'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Linkedin, Instagram, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const TextPreview = ({
  text,
  maxLines = 4,
  className
}: {
  text: string
  maxLines?: number
  className?: string
}) => {
  const t = useTranslations('Networking')
  const [isExpanded, setIsExpanded] = useState(false)
  const lines = text.split('\n')
  const hasMoreLines = lines.length > maxLines
  const displayText = isExpanded ? text : lines.slice(0, maxLines).join('\n')

  return (
    <div className="space-y-2">
      <p
        className={cn(
          'text-gray-300 text-sm leading-relaxed whitespace-pre-wrap',
          className
        )}
      >
        {displayText}
        {!isExpanded && hasMoreLines && '...'}
      </p>
      {hasMoreLines && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#6de4e8] hover:text-[#6de4e8]/80 p-0 h-auto font-medium"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 mr-1" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-1" />
          )}
          {isExpanded ? t('showLess') : t('showMore')}
        </Button>
      )}
    </div>
  )
}

export const MatchesList = ({
  matches
}: {
  matches: NetworkingMatchesType | null
}) => {
  const t = useTranslations('Networking')

  if (!matches || matches.length === 0) return null

  return (
    <div className="space-y-6 mt-4">
      {matches.map(item => {
        const { dataCollected } = item.user

        return (
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
                    src={item.user.picture || '/placeholder.svg'}
                    width={96}
                    height={96}
                    alt={t('profileImage')}
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

                {dataCollected &&
                  (dataCollected?.x ||
                    dataCollected?.linkedin ||
                    dataCollected?.instagram) && (
                    <div className="flex space-x-4">
                      {dataCollected?.x && (
                        <Link
                          href={dataCollected.x}
                          target="_blank"
                          className="block"
                        >
                          <X className="h-4 w-4" />
                        </Link>
                      )}
                      {dataCollected?.linkedin && (
                        <Link
                          href={dataCollected.linkedin}
                          target="_blank"
                          className="block"
                        >
                          <Linkedin className="h-4 w-4" />
                        </Link>
                      )}
                      {dataCollected?.instagram && (
                        <Link
                          href={dataCollected.instagram}
                          target="_blank"
                          className="block"
                        >
                          <Instagram className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  )}

                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-semibold text-[#6de4e8] mb-1">
                      {t('whyConnect')}:
                    </h4>
                    <TextPreview text={item.matchReason} />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#6de4e8] mb-1">
                      {t('aboutMatch')}:
                    </h4>
                    <TextPreview text={item.personDescription} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

'use client'

import { processUserMatches } from '@/lib/data/processors/processUserMatches'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Props = {
  userId: string
  eventId: string
}
export default function RedoMatches({ userId, eventId }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const admin = searchParams.get('admin')

  const handleRedoMatches = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await processUserMatches(userId, eventId, true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  if (!admin) {
    return null
  }

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {error && <div>{error}</div>}
      <button onClick={handleRedoMatches}>Redo Matches</button>
    </div>
  )
}

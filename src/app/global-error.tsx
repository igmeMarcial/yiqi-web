'use client'

import NextError from 'next/error'
import { useEffect } from 'react'

export default function GlobalError({
  error
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_ENABLED !== 'false') {
      import('@sentry/nextjs')
        .then(Sentry => {
          Sentry.captureException(error)
        })
        .catch(err => {
          console.error('Failed to load Sentry:', err)
        })
    } else {
      console.error('Application error:', error)
    }
  }, [error])

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}

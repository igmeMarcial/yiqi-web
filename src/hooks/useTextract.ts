'use client'
import { useState, useCallback } from 'react'

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'image/tiff'
]

interface UseTextractResult {
  extractText: (file: File) => Promise<void>
  extractedText: string | null
  isLoading: boolean
  error: string | null
}

export function useTextract(): UseTextractResult {
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const extractText = useCallback(async (file: File): Promise<void> => {
    setExtractedText(null)
    setError(null)
    setIsLoading(true)

    try {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error(
          'Invalid file type. Please upload a JPEG, PNG, PDF, or TIFF file.'
        )
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/aws/textract/', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to extract text. Please try again.')
      }

      const data = await response.json()
      setExtractedText(data.text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    extractText,
    extractedText,
    isLoading,
    error
  }
}

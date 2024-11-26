'use server'

import mammoth from 'mammoth'
export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    console.error('Error extracting text from DOCX:', error)
    throw new Error('Failed to extract text from DOCX')
  }
}

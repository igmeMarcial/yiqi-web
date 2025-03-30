'use server'
import mistralClient from './client'

/**
 * Extracts all markdown text from a document using Mistral OCR API
 * @param documentUrl URL of the document to process
 * @returns Promise resolving to concatenated markdown string from all pages
 */
export async function extractTextMistral(documentUrl: string): Promise<string> {
  try {
    const ocrResponse = await mistralClient.ocr.process({
      model: 'mistral-ocr-latest',
      document: {
        type: 'document_url',
        documentUrl: documentUrl
      },
      includeImageBase64: false
    })

    // Extract markdown from all pages and concatenate with double newlines between pages
    if (ocrResponse && Array.isArray(ocrResponse.pages)) {
      return ocrResponse.pages.map(page => page.markdown).join('\n\n')
    }

    return ''
  } catch (error) {
    console.error('Error extracting text:', error)
    throw new Error(
      `Failed to extract text: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

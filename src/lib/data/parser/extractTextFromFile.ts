import { extractTextFromPDF } from '@/lib/aws/textract'
import { extractTextFromDOCX } from './extractTextFromDOCX'

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'text/plain') {
    return await file.text()
  } else if (file.type === 'application/pdf') {
    return await extractTextFromPDF(file)
  } else if (
    file.type ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return await extractTextFromDOCX(file)
  } else {
    throw new Error('Unsupported file type')
  }
}

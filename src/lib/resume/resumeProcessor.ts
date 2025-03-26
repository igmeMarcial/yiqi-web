// Define Textract supported MIME types
const TEXTRACT_SUPPORTED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/tiff'
])

export type ResumeProcessingResult = {
  publicUrl: string
  extractedText: string
  fileName: string
}

export async function processResume(
  file: File,
  onStatusUpdate: (status: string) => void
): Promise<ResumeProcessingResult> {
  try {
    // 1. Get presigned URL
    onStatusUpdate('Preparing upload...')
    console.log(
      'Starting file upload process for:',
      file.name,
      'Size:',
      (file.size / 1024 / 1024).toFixed(2),
      'MB'
    )

    const presignedResponse = await fetch('/api/aws/presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name })
    })

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.text()
      console.error('Failed to get upload URL:', errorData)
      throw new Error(
        `Failed to get upload URL: ${presignedResponse.status} ${errorData}`
      )
    }

    const { presignedUrl, s3Key, publicUrl } = await presignedResponse.json()
    console.log('Got presigned URL, S3 Key:', s3Key)

    // 2. Upload file to S3
    onStatusUpdate('Uploading file...')
    console.log('Starting upload to S3...')
    const startUpload = Date.now()

    await uploadFileToS3(file, presignedUrl)
    console.log(
      'File uploaded successfully in',
      (Date.now() - startUpload) / 1000,
      'seconds'
    )

    // 3. Extract text based on file type
    onStatusUpdate('Extracting text...')
    console.log('Starting text extraction, file type:', file.type)
    const startExtraction = Date.now()

    const extractedText = await extractText(file, s3Key)
    console.log(
      'Text extraction completed in',
      (Date.now() - startExtraction) / 1000,
      'seconds'
    )

    return {
      publicUrl,
      extractedText,
      fileName: file.name
    }
  } catch (error) {
    console.error('Resume processing error:', error)
    throw error
  }
}

async function uploadFileToS3(file: File, presignedUrl: string): Promise<void> {
  try {
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Upload failed:', uploadResponse.status, errorText)
      throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`)
    }
  } catch (uploadError) {
    console.error('Error during file upload:', uploadError)
    throw new Error(
      `Upload error: ${uploadError instanceof Error ? uploadError.message : 'Unknown upload error'}`
    )
  }
}

async function extractText(file: File, s3Key: string): Promise<string> {
  if (TEXTRACT_SUPPORTED_TYPES.has(file.type)) {
    return extractTextWithTextract(s3Key)
  } else {
    return extractTextClientSide(file)
  }
}

async function extractTextWithTextract(s3Key: string): Promise<string> {
  try {
    const textractResponse = await fetch('/api/aws/textract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ s3Key })
    })

    if (!textractResponse.ok) {
      const errorText = await textractResponse.text()
      throw new Error(
        `Text extraction failed: ${textractResponse.status} ${errorText}`
      )
    }

    const { text } = await textractResponse.json()
    return text
  } catch (error) {
    console.error('Error during Textract processing:', error)
    throw error
  }
}

async function extractTextClientSide(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase()

  if (fileExtension === 'doc') {
    throw new Error(
      'DOC format is not supported. Please convert to DOCX or PDF.'
    )
  }

  console.log('Starting client-side extraction for', fileExtension, 'file')
  const arrayBuffer = await file.arrayBuffer()

  try {
    switch (fileExtension) {
      case 'docx':
        return parseDocx(arrayBuffer)
      case 'odt':
        return parseOdt(arrayBuffer)
      case 'txt':
      case 'csv':
        return readFileAsText(file)
      default:
        throw new Error(`Unsupported file type: ${file.type}`)
    }
  } catch (error) {
    console.error('Client-side extraction error:', error)
    throw error
  }
}

async function parseDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  } catch (error) {
    throw new Error(
      `DOCX parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

async function parseOdt(arrayBuffer: ArrayBuffer): Promise<string> {
  const JSZip = await import('jszip')
  const zip = await new JSZip.default().loadAsync(arrayBuffer)
  const content = await zip.file('content.xml')?.async('text')
  if (!content) throw new Error('Invalid ODT file')
  return extractTextFromOdtXml(content)
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = event => {
      if (event.target?.result) {
        resolve(event.target.result.toString())
      } else {
        reject(new Error('Failed to read text file'))
      }
    }
    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsText(file)
  })
}

function extractTextFromOdtXml(xmlContent: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlContent, 'text/xml')
  const paragraphs = Array.from(doc.getElementsByTagName('text:p'))

  return paragraphs
    .map(p => (p.textContent ? p.textContent.replace(/\s+/g, ' ').trim() : ''))
    .filter(text => text.length > 0)
    .join('\n\n')
}

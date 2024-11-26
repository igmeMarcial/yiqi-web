import { NextRequest, NextResponse } from 'next/server'
import {
  TextractClient,
  DetectDocumentTextCommand,
  DetectDocumentTextCommandInput
} from '@aws-sdk/client-textract'

const textractClient = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const params: DetectDocumentTextCommandInput = {
      Document: {
        Bytes: buffer
      }
    }

    const textractResponse = await textractClient.send(
      new DetectDocumentTextCommand(params)
    )

    const extractedText =
      textractResponse.Blocks?.filter(block => block.BlockType === 'LINE')
        .map(block => block.Text)
        .join('\n') ?? ''

    return NextResponse.json({ text: extractedText })
  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500 }
    )
  }
}

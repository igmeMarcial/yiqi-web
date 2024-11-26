'use client'

import React, { useRef, useState } from 'react'
import { useTextract } from '@/hooks/useTextract'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, FileText, Upload } from 'lucide-react'

interface FileInfo {
  name: string
  type: string
}

export function PrettyTextExtractor() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { extractText, extractedText, isLoading, error } = useTextract()

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setFileInfo({ name: file.name, type: file.type })
      await extractText(file)
    }
  }

  function handleButtonClick() {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Text Extractor</CardTitle>
        <CardDescription>
          Upload a file to extract text using AWS Textract
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.tiff"
              className="hidden"
              aria-label="Upload file"
            />
            <Button
              onClick={handleButtonClick}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
            {fileInfo && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>{fileInfo.name}</span>
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}
          {extractedText && (
            <div className="mt-4">
              <Label
                htmlFor="extracted-text"
                className="text-lg font-semibold mb-2"
              >
                Extracted Text:
              </Label>
              <div
                id="extracted-text"
                className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto"
              >
                <pre className="whitespace-pre-wrap break-words">
                  {extractedText}
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Supported file types: JPEG, PNG, PDF, TIFF
      </CardFooter>
    </Card>
  )
}

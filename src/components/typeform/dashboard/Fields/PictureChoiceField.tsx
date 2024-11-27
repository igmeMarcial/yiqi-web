'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { ImageIcon, Plus, X, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { useRef } from 'react'
import { FormField } from '../../types/yiqiFormTypes'
import { useToast } from '@/hooks/use-toast'

const PERMITTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif']
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

interface PictureChoiceProps {
  field: FormField
  updateField: (id: string, updatedField: Partial<FormField>) => void
}

export const PictureChoiceField: React.FC<PictureChoiceProps> = ({
  field,
  updateField
}) => {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const options = field.options || []

  const addOption = () => {
    const newOption = {
      label: '',
      value: crypto.randomUUID(),
      image: ''
    }
    updateField(field.id, {
      options: [...options, newOption]
    })
  }

  const updateOption = (
    index: number,
    updates: Partial<(typeof options)[0]>
  ) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], ...updates }
    updateField(field.id, { options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    updateField(field.id, { options: newOptions })
  }

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return

    // Validate file type
    if (!Object.keys(PERMITTED_IMAGE_TYPES).includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description:
          'Please upload a valid image file (JPG, PNG, WebP, or GIF)',
        variant: 'destructive'
      })
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive'
      })
      return
    }

    try {
      // Convert to base64 for preview
      const reader = new FileReader()
      reader.onloadend = () => {
        updateOption(index, { image: reader.result as string })
      }
      reader.readAsDataURL(file)

      // Here you would typically upload to your storage service
      // const uploadedUrl = await uploadToStorage(file)
      // updateOption(index, { image: uploadedUrl })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your image',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <ImageIcon className="h-4 w-4" />
        <span>Picture Choice</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <AnimatePresence>
          {options.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <TooltipProvider>
                <div
                  className={cn(
                    'group relative rounded-xl border-2 border-muted bg-card hover:border-primary/50 transition-all duration-200',
                    index === 0 && 'ring-1 ring-primary ring-offset-2'
                  )}
                >
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept={Object.keys(PERMITTED_IMAGE_TYPES).join(',')}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(index, file)
                      }}
                    />

                    {option.image ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={option.image}
                          alt={option.label || `Option ${index + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        >
                          <Button
                            variant="ghost"
                            size="lg"
                            className="rounded-full h-16 w-16 text-white hover:text-white hover:bg-white/20"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-6 w-6" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="lg"
                              className="rounded-full h-16 w-16"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-6 w-6 text-muted-foreground/50" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Upload image</TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-4"
                  >
                    <Input
                      value={option.label}
                      onChange={e =>
                        updateOption(index, { label: e.target.value })
                      }
                      placeholder={`Option ${index + 1}`}
                      className="border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium"
                    />
                  </motion.div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity "
                        onClick={() => removeOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove option</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="outline"
            className="max-h-[250px] w-full border-2 border-dashed rounded-xl hover:border-primary/50 hover:bg-muted/50 transition-colors"
            onClick={addOption}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add option
          </Button>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-muted-foreground mt-4"
      >
        Upload images (JPG, PNG, WebP, or GIF, max 5MB) and add labels for each
        choice.
      </motion.p>
    </div>
  )
}

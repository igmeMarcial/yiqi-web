'use client'

import React, { useCallback, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { FormProps } from './yiqiTypes'
import { generateUniqueId } from './utils'

interface AddCardButtonProps {
  fields: FormProps[]
  addCard: (
    focusedCardIndex: number,
    cardId: string,
    cardTitle?: string
  ) => void
}

const AddCardButton = ({ fields, addCard }: AddCardButtonProps) => {
  const focusedCardIndex = useMemo(
    () => fields.findIndex(card => card.isFocused),
    [fields]
  )

  useEffect(() => {
    if (fields.length < 2) {
      addCard(focusedCardIndex, generateUniqueId(), 'Pregunta')
    }
  }, [addCard, fields.length, focusedCardIndex])

  const handleAddCard = useCallback(() => {
    addCard(focusedCardIndex, generateUniqueId())
  }, [addCard, focusedCardIndex])

  return (
    <div
      className={cn(
        // Mobile positioning
        'md:static fixed bottom-6 right-4',
        // Z-index and positioning
        'z-50 md:z-auto',
        // Container styles
        'flex items-center justify-center',
        // Ensure proper stacking
        'isolation-auto'
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={handleAddCard}
                size="lg"
                className={cn(
                  // Base styles
                  'relative h-14 rounded-full shadow-lg',
                  // Desktop styles
                  'md:h-11 md:w-11 md:rounded-lg md:shadow-sm',
                  // Colors and effects
                  'bg-primary hover:bg-primary/90',
                  'text-primary-foreground',
                  // Animation
                  'transition-all duration-200',
                  // Mobile-specific styles
                  'flex items-center gap-2 px-6 md:px-3',
                  // Hover effects
                  'hover:shadow-md',
                  // Focus styles
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
                )}
              >
                <Plus className="h-5 w-5" />
                <span className="md:hidden">Add Question</span>
                <span className="sr-only">Add new question</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left" className="hidden md:block">
            Add question
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default AddCardButton

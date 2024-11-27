'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { GripVertical, Trash2, Copy, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormField } from '../types/yiqiFormTypes'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  DropdownField,
  EmailField,
  LongTextField,
  MultipleChoiceField,
  ShortTextField,
  WebsiteField
} from './FieldsBuild'
import { PhoneNumberField } from './Fields/PhoneNumberField'
import { PictureChoiceField } from './Fields/PictureChoiceField'
import { DragControls } from 'framer-motion'

import { generateUniqueId } from '../utils'
import { translations } from '@/lib/translations/translations'
const FormFieldComponentMap = {
  shortText: ShortTextField,
  longText: LongTextField,
  email: EmailField,
  phoneNumber: PhoneNumberField,
  website: WebsiteField,
  multipleChoice: MultipleChoiceField,
  dropdown: DropdownField,
  pictureChoice: PictureChoiceField
}
interface FormFieldRenderProps {
  field: FormField
  updateField: (id: string, updatedField: Partial<FormField>) => void
  removeField: (id: string) => void
  addField: (field: FormField) => void
  dragControls: DragControls
  isDragging?: boolean
  onFocusField: (field: FormField) => void
  isFocused: boolean
}

export const FormFieldRenderer: React.FC<FormFieldRenderProps> = ({
  field,
  updateField,
  removeField,
  isDragging = false,
  dragControls,
  onFocusField,
  isFocused,
  addField
}) => {
  const FieldComponent =
    FormFieldComponentMap[
      field.elementType as keyof typeof FormFieldComponentMap
    ]

  if (!FieldComponent) return null
  const handleDuplicate = () => {
    const newField = {
      ...field,
      id: generateUniqueId()
    }
    addField(newField)
    onFocusField(newField)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Delete' && e.ctrlKey) {
      e.preventDefault()
      removeField(field.id)
    }
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          'p-6 relative group transition-all duration-200 border-transparent hover:border-primary/20',
          isDragging ? 'shadow-lg ring-2 ring-primary' : 'hover:shadow-sm',
          isFocused
            ? 'ring-2  ring-[rgba(0, 178, 218, .6)] hover:border-none'
            : '',
          'mx-auto focus:ring-2 focus:ing-[rgba(0, 178, 218, .6)] focus:outline-none'
        )}
        onClick={() => onFocusField(field)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onPointerDown={event => dragControls.start(event)}
                className="p-2 rounded-md hover:bg-muted/80 cursor-grab"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{translations.es.dragToReorder}</TooltipContent>
          </Tooltip>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled={true}
                onClick={() => {}}
                className="p-1.5 hidden rounded-md hover:bg-secondary/80 text-muted-foreground transition-colors"
              >
                <Settings2 className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {translations.es.fieldSettingsElement}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleDuplicate}
                className="p-1.5 rounded-md hover:bg-secondary/80 text-muted-foreground transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{translations.es.duplicateField}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => removeField(field.id)}
                className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{translations.es.deleteField}</TooltipContent>
          </Tooltip>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Input
              value={field.question}
              onChange={e =>
                updateField(field.id, { question: e.target.value })
              }
              placeholder={translations.es.typeYourQuestion}
              className="text-lg font-medium border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
            />

            <Textarea
              value={field.description}
              onChange={e => {
                updateField(field.id, { description: e.target.value })
                e.target.style.height = 'auto'
                e.target.style.height = `${e.target.scrollHeight}px`
              }}
              placeholder={translations.es.addDescription}
              className="text-sm text-muted-foreground border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40 min-h-[24px] resize-none overflow-hidden"
            />
          </div>

          <div className="pt-1">
            {FieldComponent && (
              <FieldComponent field={field} updateField={updateField} />
            )}
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
}

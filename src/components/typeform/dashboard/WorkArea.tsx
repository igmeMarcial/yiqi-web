'use client'
import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import {
  Plus,
  Printer,
  Play,
  HelpCircle,
  Wand2,
  Settings,
  Sparkles
} from 'lucide-react'
import { Reorder, useDragControls } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FormFieldRenderer } from './FormRenderField'
import { useCallback, useEffect, useState } from 'react'
import { AddElementsModal } from './AddElementsModal'
import { createBaseField, generateUniqueId } from '../utils'
import { FormElementType, FormField } from '../types/yiqiFormTypes'
import { RightSidebar } from './RightSidebar'
import LeftSidebar from './LeftSidebar'
import { translations } from '@/lib/translations/translations'

interface WorkAreaProps {
  form: FormField[]
  addField: (field: FormField) => void
  updateField: (id: string, updatedField: Partial<FormField>) => void
  removeField: (id: string) => void
  reorderFields: (newOrder: FormField[]) => void
}

export const WorkArea: React.FC<WorkAreaProps> = ({
  form,
  addField,
  updateField,
  removeField,
  reorderFields
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [focusedField, setFocusedField] = useState<FormField | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (form.length > 0) {
      const currentFocusedField = form.find(f => f.id === focusedField?.id)
      if (!currentFocusedField && form.length > 0) {
        setFocusedField(form[0])
      } else if (currentFocusedField) {
        setFocusedField(currentFocusedField)
      }
    } else {
      setFocusedField(null)
    }
  }, [form, focusedField])
  const handleFieldUpdate = useCallback(
    (id: string, updatedField: Partial<FormField>) => {
      updateField(id, updatedField)
      setFocusedField(prev =>
        prev?.id === id ? { ...prev, ...updatedField } : prev
      )
    },
    [updateField]
  )

  const handleElementSelect = useCallback(
    (elementType: FormElementType) => {
      const baseField = createBaseField(elementType)
      const newField = {
        id: generateUniqueId(),
        ...baseField
      }
      addField(newField)
      setFocusedField(newField)
      setIsModalOpen(false)
    },
    [addField]
  )
  const handleReorder = useCallback(
    (newOrder: FormField[]) => {
      reorderFields(newOrder)
    },
    [reorderFields]
  )
  const handleRemoveField = useCallback(
    (fieldId: string) => {
      const fieldIndex = form.findIndex(f => f.id === fieldId)
      const updatedForm = form.filter(f => f.id !== fieldId)

      if (updatedForm.length > 0) {
        const newFocusIndex = fieldIndex > 0 ? fieldIndex - 1 : 0
        setFocusedField(updatedForm[newFocusIndex])
      } else {
        setFocusedField(null)
      }

      removeField(fieldId)
    },
    [form, removeField]
  )

  const dragControls = useDragControls()
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        className="hidden lg:block"
        defaultSize={20}
        minSize={15}
        maxSize={30}
      >
        <LeftSidebar
          setFocusedField={setFocusedField}
          addField={addField}
          form={form}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex flex-col h-full p-0 lg:p-4 ">
          <div className="flex items-center gap-2 max-h-14 p-2  rounded-none lg:rounded-xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 rounded-none lg:rounded-xl pointer-events-none" />
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-30 blur-2xl rounded-none lg:rounded-xl pointer-events-none" />
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              {translations.es.addContentButton}
            </Button>
            <Button disabled variant="ghost" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
            <Button disabled variant="ghost" size="icon">
              <Play className="h-4 w-4" />
            </Button>
            <Button disabled variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button disabled variant="ghost" size="icon">
              <Wand2 className="h-4 w-4" />
            </Button>
            <Button disabled variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <AddElementsModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            onElementSelect={handleElementSelect}
          />
          <div className="flex-grow overflow-hidden bg-muted/5 ">
            <ScrollArea className="h-[calc(100vh-144px)] pt-4">
              <Reorder.Group
                axis="y"
                values={form}
                onReorder={handleReorder}
                className={form.length === 0 ? 'p-0' : 'space-y-3 py-4'}
              >
                {form.map(field => (
                  <Reorder.Item
                    key={field.id}
                    value={field}
                    dragListener={false}
                    dragControls={dragControls}
                    className="w-[95%] sm:w-[90%]  md:w-[85%] lg:w-[80%] mx-auto"
                  >
                    <FormFieldRenderer
                      field={field}
                      updateField={handleFieldUpdate}
                      removeField={handleRemoveField}
                      addField={addField}
                      dragControls={dragControls}
                      onFocusField={() => setFocusedField(field)}
                      isFocused={focusedField?.id === field.id}
                    />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              {form.length === 0 && (
                <div className="w-full h-full  animate-fade-in ">
                  <div className="relative h-full">
                    <div className="relative h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Plus className="w-8 h-8 text-primary" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold tracking-tight">
                          {translations.es.startCreatingFormHeader}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-[15rem] mx-auto">
                          {translations.es.buildPerfectFormText}
                        </p>
                      </div>

                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6de4e8]/30 to-[#00b2da]/30 rounded-md blur opacity-20 group-hover:opacity-40 transition duration-500" />

                        <Button
                          onClick={() => setIsModalOpen(true)}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6de4e8] to-[#00b2da]/60 hover:from-[#6de4e8]/90 hover:to-[#00b2da]/50 text-primary-foreground rounded-md transition-all duration-300 hover:shadow-[0_0_10px_rgba(109,228,232,0.2)] hover:-translate-y-0.5 transform"
                        >
                          <span
                            className={`transform transition-transform duration-300 ${isHovered ? 'rotate-180' : 'rotate-0'}`}
                          >
                            <Plus className="w-4 h-4" />
                          </span>

                          <span className="relative text-sm font-medium">
                            {translations.es.addFirstFieldButton}
                          </span>

                          <span
                            className={`transform transition-all duration-300 ${
                              isHovered
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 -translate-x-2'
                            }`}
                          >
                            <Sparkles className="w-4 h-4 text-white/70" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        className="hidden sm:block"
        defaultSize={20}
        minSize={15}
        maxSize={30}
      >
        <RightSidebar updateField={handleFieldUpdate} field={focusedField} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

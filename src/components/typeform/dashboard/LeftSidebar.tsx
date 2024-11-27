import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Frown, Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formElements } from '../data/fields'
import { motion } from 'framer-motion'
import { FormElementType, FormField } from '../types/yiqiFormTypes'
import { createBaseField, generateUniqueId } from '../utils'
import { translations } from '@/lib/translations/translations'

interface SidebarProps {
  addField: (field: FormField) => void
  setFocusedField: (field: FormField | null) => void
  form: FormField[]
}
function LeftSidebar({ addField, setFocusedField, form }: SidebarProps) {
  const handleAddField = (elementType: FormElementType) => {
    const baseField = createBaseField(elementType)
    const newField = {
      id: generateUniqueId(),
      ...baseField
    }
    addField(newField)
    setFocusedField(newField)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="h-full flex flex-col space-y-4 p-4">
        <Card className="flex-1 flex flex-col">
          <CardContent className="p-0 pt-2 h-full flex flex-col ">
            <ScrollArea className="h-[250px] w-full">
              {form.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                  <Frown size={64} className="text-gray-100 mb-4 opacity-5" />
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {form.map(item => (
                    <div key={item.id} className="p-3 rounded-lg bg-muted">
                      {item.elementType}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex-1 ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">
              {translations.es.formElements}
            </CardTitle>
            <Button disabled variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 ">
            <ScrollArea className="h-[250px] w-full">
              <div className="p-4 space-y-4 ">
                {formElements.map((field, index) => (
                  <motion.div
                    key={field.elementType}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 h-auto py-4"
                      onClick={() => handleAddField(field.elementType)}
                    >
                      <field.icon className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">{field.label}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {field.description}
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LeftSidebar

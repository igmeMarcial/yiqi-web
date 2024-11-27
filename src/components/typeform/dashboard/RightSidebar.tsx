'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { FormField } from '../types/yiqiFormTypes'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import Image from 'next/image'
import { translations } from '@/lib/translations/translations'

interface SidebarProps {
  field?: FormField | null
  updateField: (id: string, updatedField: Partial<FormField>) => void
}
export function RightSidebar({ field, updateField }: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        {field ? (
          <div className="p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">
                {translations.es.fieldSettings}
              </h3>
              <p className="text-sm text-muted-foreground">
                {translations.es.configureFieldText}
              </p>
            </div>
            <div className="space-y-6">
              <Card className="p-4 space-y-4 gradient-border">
                <div className="flex items-center justify-between">
                  <Label htmlFor="required" className="font-medium">
                    {translations.es.required}
                  </Label>
                  <Switch
                    id="required"
                    checked={field.required}
                    onCheckedChange={checked =>
                      updateField(field.id, { required: checked })
                    }
                  />
                </div>

                {field.elementType !== 'multipleChoice' &&
                  field.elementType !== 'dropdown' &&
                  field.elementType !== 'yesNo' && (
                    <div className="space-y-2">
                      <Label htmlFor="placeholder" className="font-medium">
                        {translations.es.placeholder}
                      </Label>
                      <Input
                        id="placeholder"
                        value={field.placeholder ?? ''}
                        onChange={e =>
                          updateField(field.id, {
                            placeholder: e.target.value
                          })
                        }
                        placeholder={translations.es.placeholder}
                      />
                    </div>
                  )}

                <div className="space-y-2">
                  <Label htmlFor="hint" className="font-medium">
                    {translations.es.helpText}
                  </Label>
                  <Textarea
                    id="hint"
                    value={field.hint ?? ''}
                    onChange={e =>
                      updateField(field.id, { hint: e.target.value })
                    }
                    placeholder={translations.es.helpText}
                    className="resize-none"
                  />
                </div>
              </Card>

              <Separator className="my-4" />
              {field.elementType === 'longText' && (
                <Card className="p-4 space-y-4 gradient-border">
                  <h4 className="font-medium text-sm">
                    {translations.es.longTextSettings}
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="summary" className="font-medium">
                      {translations.es.summary}
                    </Label>
                    <Input
                      id="summary"
                      value={field.summary ?? ''}
                      onChange={e =>
                        updateField(field.id, {
                          summary: e.target.value
                        })
                      }
                      placeholder="Enter summary"
                    />
                  </div>
                </Card>
              )}
              {(field.elementType === 'email' ||
                field.elementType === 'phoneNumber') && (
                <Card className="p-4 space-y-4 gradient-border">
                  <h4 className="font-medium text-sm">
                    {translations.es.validationSettings}
                  </h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="validation" className="font-medium">
                      {translations.es.enableValidation}
                      {field.elementType === 'phoneNumber' ? 'Phone' : 'Email'}
                    </Label>
                    <Switch
                      id="validation"
                      checked={
                        field.validation ===
                        (field.elementType === 'email' ? 'email' : 'phone')
                      }
                      onCheckedChange={checked =>
                        updateField(field.id, {
                          validation: checked
                            ? field.elementType === 'email'
                              ? 'email'
                              : 'phone'
                            : undefined
                        })
                      }
                    />
                  </div>
                </Card>
              )}
              {(field.elementType === 'multipleChoice' ||
                field.elementType === 'dropdown' ||
                field.elementType === 'pictureChoice') && (
                <Card className="p-4 space-y-4 gradient-border">
                  <h4 className="font-medium text-sm">
                    {translations.es.choiceSettings}
                  </h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multiple" className="font-medium">
                      {translations.es.allowMultipleSelection}
                    </Label>
                    <Switch
                      id="multiple"
                      checked={field.multiple}
                      onCheckedChange={checked =>
                        updateField(field.id, {
                          multiple: checked
                        })
                      }
                    />
                  </div>
                </Card>
              )}
              {(field.elementType === 'number' ||
                field.elementType === 'rating') && (
                <Card className="p-4 space-y-4 gradient-border">
                  <h4 className="font-medium text-sm">
                    {translations.es.numberSettings}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minValue">
                        {translations.es.minValue}
                      </Label>
                      <Input
                        id="minValue"
                        type="number"
                        value={field.minValue ?? ''}
                        onChange={e =>
                          updateField(field.id, {
                            minValue: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxValue">
                        {translations.es.maxValue}
                      </Label>
                      <Input
                        id="maxValue"
                        type="number"
                        value={field.maxValue ?? ''}
                        onChange={e =>
                          updateField(field.id, {
                            maxValue: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                </Card>
              )}
              {field.elementType === 'fileUpload' && (
                <Card className="p-4 space-y-4 gradient-border">
                  <h4 className="font-medium text-sm">
                    {translations.es.fileUploadSettings}
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxFileSize">
                        {translations.es.maxFileSize} (MB)
                      </Label>
                      <Input
                        id="maxFileSize"
                        type="number"
                        value={field.maxFileSize ?? ''}
                        onChange={e =>
                          updateField(field.id, {
                            maxFileSize: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accept">
                        {translations.es.allowedFileTypes}
                      </Label>
                      <Select
                        value={field.accept ?? ''}
                        onValueChange={value =>
                          updateField(field.id, {
                            accept: value
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={translations.es.allowedFileTypes}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image/*">
                            {translations.es.images}
                          </SelectItem>
                          <SelectItem value="application/pdf">
                            {translations.es.pdf}
                          </SelectItem>
                          <SelectItem value=".doc,.docx">
                            {translations.es.wordDocuments}
                          </SelectItem>
                          <SelectItem value="*">
                            {translations.es.allFiles}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full border-l border-border bg-card">
            <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
              <div className="relative  flex  justify-center max-w-[240px]  mx-auto">
                <Image
                  src="https://www.yiqi.lat/_next/image?url=%2Flogo.png&w=128&q=75"
                  alt="Settings illustration"
                  height={40}
                  width={80}
                  objectFit="contain"
                  className="opacity-50"
                />
              </div>

              <div className="space-y-2 text-center max-w-[280px] mx-auto">
                <h3 className="text-lg font-medium tracking-tight">
                  {translations.es.configureYourField}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {translations.es.selectFieldText}
                </p>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

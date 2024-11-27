import { FormField } from '../types/yiqiFormTypes'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Type,
  AlignLeft,
  ListChecks,
  ChevronDown,
  Plus,
  X,
  Mail,
  Phone,
  Globe
} from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TextFieldProps {
  field: FormField
  updateField: (id: string, updatedField: Partial<FormField>) => void
}

export const ShortTextField: React.FC<TextFieldProps> = ({
  field,
  updateField
}) => (
  <div className="w-full">
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
      <Type className="h-4 w-4" />
      <span>Short text</span>
    </div>
    <Input
      value={field.placeholder ?? ''}
      onChange={e => updateField(field.id, { placeholder: e.target.value })}
      placeholder="Short text answer"
      className="w-full bg-muted/50 border-none"
      disabled
    />
  </div>
)

export const LongTextField: React.FC<TextFieldProps> = ({
  field,
  updateField
}) => (
  <div className="w-full">
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
      <AlignLeft className="h-4 w-4" />
      <span>Long text</span>
    </div>
    <Textarea
      value={field.placeholder ?? ''}
      onChange={e => updateField(field.id, { placeholder: e.target.value })}
      placeholder="Long text answer"
      className="min-h-[80px] w-full bg-muted/50 border-none resize-none"
      disabled
    />
  </div>
)
export const EmailField: React.FC<TextFieldProps> = ({
  field,
  updateField
}) => (
  <div className="w-full">
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
      <Mail className="h-4 w-4" />
      <span>Email</span>
    </div>
    <Input
      type="email"
      value={field.placeholder ?? ''}
      onChange={e => updateField(field.id, { placeholder: e.target.value })}
      placeholder="email@example.com"
      className="w-full bg-muted/50 border-none"
      disabled
    />
    <p className="text-xs text-muted-foreground mt-1.5">
      Responses will be validated as email addresses
    </p>
  </div>
)

export const MultipleChoiceField: React.FC<TextFieldProps> = ({
  field,
  updateField
}) => {
  const options = field.options || []

  const addOption = () => {
    const newOption = {
      label: '',
      value: crypto.randomUUID()
    }
    updateField(field.id, {
      options: [...options, newOption]
    })
  }

  const updateOption = (index: number, label: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], label }
    updateField(field.id, { options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    updateField(field.id, { options: newOptions })
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <ListChecks className="h-4 w-4" />
        <span>Multiple choice</span>
      </div>

      <div className="space-y-2">
        <RadioGroup className="gap-2" disabled>
          {options.map((option, index) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} className="mt-0.5" />
              <Input
                value={option.label}
                onChange={e => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => removeOption(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={addOption}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add option
        </Button>
      </div>
    </div>
  )
}

export const DropdownField: React.FC<TextFieldProps> = ({
  field,
  updateField
}) => {
  const options = field.options || []

  const addOption = () => {
    const newOption = {
      label: '',
      value: crypto.randomUUID()
    }
    updateField(field.id, {
      options: [...options, newOption]
    })
  }

  const updateOption = (index: number, label: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], label }
    updateField(field.id, { options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    updateField(field.id, { options: newOptions })
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <ChevronDown className="h-4 w-4" />
        <span>Dropdown</span>
      </div>

      <div className="space-y-2">
        <Select disabled>
          <SelectTrigger className="w-full bg-muted/50">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>

        <div className="space-y-2 mt-4">
          {options.map((option, index) => (
            <div key={option.value} className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center text-sm text-muted-foreground">
                {index + 1}
              </div>
              <Input
                value={option.label}
                onChange={e => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => removeOption(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={addOption}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add option
        </Button>
      </div>
    </div>
  )
}

export const PhoneNumberField: React.FC<TextFieldProps> = ({
  field,
  updateField
}) => (
  <div className="w-full">
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
      <Phone className="h-4 w-4" />
      <span>Phone number</span>
    </div>
    <Input
      type="tel"
      value={field.placeholder ?? ''}
      onChange={e => updateField(field.id, { placeholder: e.target.value })}
      placeholder="+1 (555) 000-0000"
      className="w-full bg-muted/50 border-none"
      disabled
    />
    <p className="text-xs text-muted-foreground mt-1.5">
      International phone number format
    </p>
  </div>
)

export const WebsiteField: React.FC<TextFieldProps> = ({
  field,
  updateField
}) => (
  <div className="w-full">
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
      <Globe className="h-4 w-4" />
      <span>Website</span>
    </div>
    <Input
      type="url"
      value={field.placeholder ?? ''}
      onChange={e => updateField(field.id, { placeholder: e.target.value })}
      placeholder="https://example.com"
      className="w-full bg-muted/50 border-none"
      disabled
    />
    <p className="text-xs text-muted-foreground mt-1.5">
      Responses will be validated as URLs
    </p>
  </div>
)

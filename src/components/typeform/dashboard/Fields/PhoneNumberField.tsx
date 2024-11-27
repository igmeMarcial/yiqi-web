'use client'

import { Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { useState } from 'react'
import { FormField } from '../../types/yiqiFormTypes'
import { countries, formatPhoneNumber, getCountryById } from '../../utils'

interface PhoneNumberFieldProps {
  field: FormField
  updateField: (id: string, updatedField: Partial<FormField>) => void
}

export const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  field,
  updateField
}) => {
  const countryList = field.phoneConfig?.countryList ?? countries
  const [selectedCountry, setSelectedCountry] = useState(
    countryList.find(c => c.id === field.phoneConfig?.selectedCountryId) ||
      countries[0]
  )
  const handleCountryChange = (countryId: string) => {
    const country = getCountryById(countryId)
    setSelectedCountry(country)
    updateField(field.id, {
      placeholder: '',
      validation: 'phone',
      defaultValue: country.id,
      phoneConfig: {
        ...field.phoneConfig,
        selectedCountryId: countryId
      }
    })
  }
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountry.format)
    updateField(field.id, {
      placeholder: formatted,
      validation: 'phone',
      phoneConfig: {
        ...field.phoneConfig,
        selectedCountryId: selectedCountry.id
      }
    })
  }
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Phone className="h-4 w-4" />
        <span>Phone number</span>
      </div>

      <div className="flex gap-2">
        <Select
          value={field.defaultValue ?? selectedCountry.id}
          onValueChange={handleCountryChange}
        >
          <SelectTrigger className="w-[140px] bg-muted/50 border-none">
            <SelectValue placeholder="Select country">
              <span className="flex items-center gap-2">
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.code}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem
                key={country.id}
                value={country.id}
                className="cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="text-muted-foreground">{country.code}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1">
          <Input
            type="tel"
            value={field.placeholder ?? ''}
            onChange={handlePhoneChange}
            placeholder={selectedCountry.placeholder}
            className={cn(
              'w-full bg-muted/50 border-none',
              'placeholder:text-muted-foreground/50'
            )}
            disabled
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          Example: {selectedCountry.flag} {selectedCountry.code}{' '}
          {selectedCountry.example}
        </p>
        {field.validation === 'phone' && (
          <p>Please enter a valid phone number for {selectedCountry.name}</p>
        )}
      </div>
    </div>
  )
}

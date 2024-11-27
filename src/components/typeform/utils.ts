import { FormElementType, FormField } from './types/yiqiFormTypes'

export function generateUniqueId(): string {
  // Genera un timestamp en milisegundos y un número aleatorio
  const timestamp = Date.now().toString(36) // Convierte el tiempo a base 36
  const randomNum = Math.random().toString(36).substring(2, 8) // Número aleatorio en base 36
  // Combina ambos para formar un ID único
  return `${timestamp}-${randomNum}`
}

export interface CountryOption {
  id: string
  name: string
  flag: string
  code: string
  format: string
  placeholder: string
  example: string
}

export const countries: CountryOption[] = [
  {
    id: 'pe',
    name: 'Peru',
    flag: '🇵🇪',
    code: '+51',
    format: '(###) ###-####',
    placeholder: '(987) 654-321',
    example: '(987) 654-321'
  },
  {
    id: 'mx',
    name: 'Mexico',
    flag: '🇲🇽',
    code: '+52',
    format: '(###) ###-####',
    placeholder: '(55) 1234-5678',
    example: '(55) 1234-5678'
  },
  {
    id: 'us',
    name: 'United States',
    flag: '🇺🇸',
    code: '+1',
    format: '(###) ###-####',
    placeholder: '(555) 555-5555',
    example: '(555) 555-5555'
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    flag: '🇬🇧',
    code: '+44',
    format: '#### ######',
    placeholder: '7911 123456',
    example: '7911 123456'
  },
  {
    id: 'es',
    name: 'Spain',
    flag: '🇪🇸',
    code: '+34',
    format: '### ### ###',
    placeholder: '612 345 678',
    example: '612 345 678'
  },
  {
    id: 'cl',
    name: 'Chile',
    flag: '🇨🇱',
    code: '+56',
    format: '(##) ####-####',
    placeholder: '(2) 2345-6789',
    example: '(2) 2345-6789'
  },
  {
    id: 'co',
    name: 'Colombia',
    flag: '🇨🇴',
    code: '+57',
    format: '(###) ###-####',
    placeholder: '(1) 2345-6789',
    example: '(1) 2345-6789'
  },
  {
    id: 'de',
    name: 'Germany',
    flag: '🇩🇪',
    code: '+49',
    format: '### #######',
    placeholder: '151 2345678',
    example: '151 2345678'
  },
  {
    id: 'fr',
    name: 'France',
    flag: '🇫🇷',
    code: '+33',
    format: '# ## ## ## ##',
    placeholder: '6 12 34 56 78',
    example: '6 12 34 56 78'
  }
]
export const getCountryById = (id: string): CountryOption => {
  return countries.find(country => country.id === id) || countries[0]
}

export const formatPhoneNumber = (value: string, format: string): string => {
  const digits = value.replace(/\D/g, '')
  const formatChars = format.split('')
  let formatted = ''
  let digitIndex = 0

  formatChars.forEach(char => {
    if (digitIndex >= digits.length) return
    if (char === '#') {
      formatted += digits[digitIndex]
      digitIndex++
    } else {
      formatted += char
    }
  })

  return formatted
}

export const createBaseField = (
  type: FormElementType
): Omit<FormField, 'id'> => {
  const baseField: Omit<FormField, 'id'> = {
    elementType: type,
    question: '',
    description: '',
    name: '',
    required: true
  }

  switch (type) {
    case 'multipleChoice':
    case 'dropdown':
      baseField.options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ]
      break
    case 'yesNo':
      baseField.options = [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]
      break
    case 'email':
      baseField.validation = 'email'
      break
    case 'phoneNumber':
      baseField.validation = 'phone'
      break
  }

  return baseField
}

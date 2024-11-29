import {
  TextIcon,
  Mail,
  Phone,
  Video,
  Calendar,
  Hash,
  Star,
  Upload,
  ListTree,
  Globe,
  ImageIcon
} from 'lucide-react'
import { FormElement, FormElementType } from '../types/yiqiFormTypes'
import { translations } from '@/lib/translations/translations'

export const placeholderQuestions: Record<FormElementType, string> = {
  email: 'Enter your email address',
  phoneNumber: 'Enter your phone number',
  address: 'Enter the address here',
  website: 'Enter the website URL here',
  longText: 'Write your answer here...',
  shortText: 'Short answer here',
  video: 'Paste the video link here',
  multipleChoice: 'Select an option',
  dropdown: 'Choose an option',
  pictureChoice: 'Select your image choice',
  yesNo: 'Please select yes or no',
  date: 'enter date',
  fileUpload: 'enter file',
  number: 'enter number',
  rating: 'enter rating'
}

export const placeholderDescriptions: Record<FormElementType, string> = {
  email: 'Enter a valid email address',
  phoneNumber: 'Enter a valid phone number (optional)',
  address: 'Enter the full address with city and postal code',
  website: 'Provide a valid website URL (optional)',
  longText: 'Write a detailed response (optional)',
  shortText: 'Provide a short description (optional)',
  video: 'Enter the video URL (YouTube, Vimeo, etc.)',
  multipleChoice: 'Choose one or more options',
  dropdown: 'Select an option from the dropdown',
  pictureChoice: 'Select an image as your answer',
  yesNo: 'Please select either "Yes" or "No"',
  date: 'enter date',
  fileUpload: 'enter file',
  number: 'enter number',
  rating: 'enter rating'
}

// Separate arrays for each category
export const textInputsElements: FormElement[] = [
  {
    elementType: 'longText',
    icon: ListTree,
    label: translations.es.longTextElement,
    description: 'For longer answers'
  },
  {
    elementType: 'shortText',
    icon: TextIcon,
    label: translations.es.shortTextElement,
    description: 'For short answers'
  }
]

export const contactInformationElements: FormElement[] = [
  {
    elementType: 'email',
    icon: Mail,
    label: translations.es.emailElement,
    description: 'For email input'
  },
  {
    elementType: 'phoneNumber',
    icon: Phone,
    label: translations.es.phoneNumberElement,
    description: 'For phone number input'
  },
  {
    elementType: 'website',
    icon: Globe,
    label: translations.es.websiteElement,
    description: 'For website URLs'
  }
]

export const mediaElements: FormElement[] = [
  {
    elementType: 'video',
    icon: Video,
    label: translations.es.videoTextElement,
    description: 'Add video content'
  },

  {
    elementType: 'fileUpload',
    icon: Upload,
    label: translations.es.fileUploadTextElement,
    description: 'Allow file uploads'
  },
  {
    elementType: 'pictureChoice',
    icon: ImageIcon,
    label: translations.es.pictureChoiceTextElement,
    description: 'Choose from images'
  }
]

export const choiceElements: FormElement[] = [
  {
    elementType: 'multipleChoice',
    icon: ListTree,
    label: translations.es.multipleChoiceElement,
    description: 'Multiple options, one choice'
  },
  {
    elementType: 'dropdown',
    icon: ListTree,
    label: translations.es.dropdownElement,
    description: 'Select from a list'
  }
]

export const numbersAndDatesElements: FormElement[] = [
  {
    elementType: 'date',
    icon: Calendar,
    label: translations.es.dateElement,
    description: 'Date picker input'
  },
  {
    elementType: 'number',
    icon: Hash,
    label: translations.es.numberElement,
    description: 'Numerical input'
  },
  {
    elementType: 'rating',
    icon: Star,
    label: translations.es.ratingElement,
    description: 'Rating scale input'
  }
]

export const formElements: FormElement[] = [
  ...textInputsElements,
  ...contactInformationElements,
  ...choiceElements
]

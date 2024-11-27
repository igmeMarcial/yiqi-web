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
    label: 'Long Text',
    description: 'For longer answers'
  },
  {
    elementType: 'shortText',
    icon: TextIcon,
    label: 'Short Text',
    description: 'For short answers'
  }
]

export const contactInformationElements: FormElement[] = [
  {
    elementType: 'email',
    icon: Mail,
    label: 'Email Address',
    description: 'For email input'
  },
  {
    elementType: 'phoneNumber',
    icon: Phone,
    label: 'Phone Number',
    description: 'For phone number input'
  },
  {
    elementType: 'website',
    icon: Globe,
    label: 'Website',
    description: 'For website URLs'
  }
]

export const mediaElements: FormElement[] = [
  {
    elementType: 'video',
    icon: Video,
    label: 'Video',
    description: 'Add video content'
  },

  {
    elementType: 'fileUpload',
    icon: Upload,
    label: 'File Upload',
    description: 'Allow file uploads'
  },
  {
    elementType: 'pictureChoice',
    icon: ImageIcon,
    label: 'Picture Choice',
    description: 'Choose from images'
  }
]

export const choiceElements: FormElement[] = [
  {
    elementType: 'multipleChoice',
    icon: ListTree,
    label: 'Multiple Choice',
    description: 'Multiple options, one choice'
  },
  {
    elementType: 'dropdown',
    icon: ListTree,
    label: 'Dropdown',
    description: 'Select from a list'
  }
]

export const numbersAndDatesElements: FormElement[] = [
  {
    elementType: 'date',
    icon: Calendar,
    label: 'Date',
    description: 'Date picker input'
  },
  {
    elementType: 'number',
    icon: Hash,
    label: 'Number',
    description: 'Numerical input'
  },
  {
    elementType: 'rating',
    icon: Star,
    label: 'Rating',
    description: 'Rating scale input'
  }
]

export const formElements: FormElement[] = [
  ...textInputsElements,
  ...contactInformationElements,
  ...choiceElements
]

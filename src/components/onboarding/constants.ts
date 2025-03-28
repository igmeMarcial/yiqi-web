import { NetworkingData } from '../profile/common'

export type QuestionStep = {
  id: string
  title: string
  description: string
  field: keyof NetworkingData | 'complete'
  type: 'radio' | 'checkbox' | 'text' | 'textarea' | 'file' | 'complete'
  options?: Option[]
  placeholder?: string
}

type Option = {
  value: string
  label: string
}

export const ONBOARDING_STEPS: QuestionStep[] = [
  {
    id: 'intro',
    title: 'welcomeTitle',
    description: 'welcomeDescription',
    field: 'complete',
    type: 'complete'
  },
  {
    id: 'resume',
    title: 'resumeTitle',
    description: 'resumeDescription',
    field: 'resumeUrl',
    type: 'file'
  },
  {
    id: 'professionalMotivations',
    title: 'motivationsTitle',
    description: 'motivationsDescription',
    field: 'professionalMotivations',
    type: 'radio',
    options: [
      { value: 'impact', label: 'motivationsOption1' },
      { value: 'growth', label: 'motivationsOption2' },
      { value: 'stability', label: 'motivationsOption3' },
      { value: 'creativity', label: 'motivationsOption4' },
      { value: 'leadership', label: 'motivationsOption5' },
      { value: 'other', label: 'other' }
    ]
  },
  {
    id: 'communicationStyle',
    title: 'communicationTitle',
    description: 'communicationDescription',
    field: 'communicationStyle',
    type: 'radio',
    options: [
      { value: 'direct', label: 'communicationOption1' },
      { value: 'collaborative', label: 'communicationOption2' },
      { value: 'analytical', label: 'communicationOption3' },
      { value: 'supportive', label: 'communicationOption4' },
      { value: 'other', label: 'other' }
    ]
  },
  {
    id: 'professionalValues',
    title: 'valuesTitle',
    description: 'valuesDescription',
    field: 'professionalValues',
    type: 'checkbox',
    options: [
      { value: 'autonomy', label: 'valuesOption1' },
      { value: 'balance', label: 'valuesOption2' },
      { value: 'ethics', label: 'valuesOption3' },
      { value: 'innovation', label: 'valuesOption4' },
      { value: 'recognition', label: 'valuesOption5' },
      { value: 'teamwork', label: 'valuesOption6' },
      { value: 'other', label: 'other' }
    ]
  },
  {
    id: 'careerAspirations',
    title: 'aspirationsTitle',
    description: 'aspirationsDescription',
    field: 'careerAspirations',
    type: 'radio',
    options: [
      { value: 'leadership', label: 'aspirationsOption1' },
      { value: 'specialist', label: 'aspirationsOption2' },
      { value: 'entrepreneur', label: 'aspirationsOption3' },
      { value: 'mentor', label: 'aspirationsOption4' },
      { value: 'other', label: 'other' }
    ]
  },
  {
    id: 'significantChallenge',
    title: 'challengeTitle',
    description: 'challengeDescription',
    field: 'significantChallenge',
    type: 'radio',
    options: [
      { value: 'technical', label: 'challengeOption1' },
      { value: 'team', label: 'challengeOption2' },
      { value: 'resources', label: 'challengeOption3' },
      { value: 'leadership', label: 'challengeOption4' },
      { value: 'other', label: 'other' }
    ]
  },
  {
    id: 'completion',
    title: 'completionTitle',
    description: 'completionDescription',
    field: 'complete',
    type: 'complete'
  }
]

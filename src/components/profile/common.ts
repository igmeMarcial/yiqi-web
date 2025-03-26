import { ProfileWithPrivacy } from '@/schemas/userSchema'

export type NetworkingData = {
  professionalMotivations: string
  communicationStyle: string
  professionalValues: string
  careerAspirations: string
  significantChallenge: string
  resumeUrl: string
  resumeText: string
  resumeLastUpdated: string
  resumeFileName: string
}

export type Props = {
  initialData: NetworkingData
  user: ProfileWithPrivacy
}

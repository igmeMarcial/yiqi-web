export interface Host {
  name: string
  image: string
  instagramUrl?: string
}

export interface PublicEvent {
  title: string
  subtitle: string
  date: string
  startTime: string
  endTime: string
  location: string
  city: string
  description: string
  backgroundColor: string
  hosts: Host[]
  featuredIn?: {
    name: string
    url: string
  }
  heroImage: string
}

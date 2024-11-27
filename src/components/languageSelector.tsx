'use client'

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select
} from '@/components/ui/select'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LangSelector() {
  const localActive = useLocale()
  const [selectedLanguage, setSelectedLanguage] = useState(localActive)

  // language switch
  const router = useRouter()
  const pathname = usePathname()
  const onselectchange = (value: string) => {
    const nextLocale = value
    setSelectedLanguage(nextLocale)
    if (pathname) {
      const newUrl = pathname.replace(
        new RegExp(`^/(${localActive})`),
        `/${nextLocale}`
      )
      router.replace(newUrl)
    }
  }
  return (
    <div className="w-25">
      <Select defaultValue={localActive} onValueChange={onselectchange}>
        <SelectTrigger
          id="language"
          className="w-[180px] bg-transparent text-white"
        >
          <SelectValue
            placeholder="Select Language"
            className="bg-transparent text-white"
          >
            {selectedLanguage === 'en' && 'English'}
            {selectedLanguage === 'es' && 'Spanish'}
            {selectedLanguage === 'fr' && 'French'}
            {selectedLanguage === 'pt' && 'Portuguese'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="bg-zinc-900 border-none text-white"
        >
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Spanish</SelectItem>
          <SelectItem value="fr">French</SelectItem>
          <SelectItem value="pt">Portuguese</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

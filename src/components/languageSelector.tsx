'use client'

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select
} from '@/components/ui/select'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import { setCookie } from 'cookies-next'

type Language = 'en' | 'es' | 'fr' | 'pt'

function getLanguageName(lang: Language): string {
  const languageNames: Record<Language, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    pt: 'Portuguese'
  }
  return languageNames[lang]
}

export default function LangSelector(): JSX.Element {
  const localActive = useLocale() as Language
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(localActive)

  function handleLanguageChange(value: string): void {
    const nextLocale = value as Language
    setSelectedLanguage(nextLocale)
    setCookie('locale', nextLocale, { maxAge: 60 * 60 * 24 * 365 })
    window.location.reload()
  }

  return (
    <div className="w-25">
      <Select defaultValue={localActive} onValueChange={handleLanguageChange}>
        <SelectTrigger
          id="language"
          className="w-[180px] bg-transparent text-white"
        >
          <SelectValue
            placeholder="Select Language"
            className="bg-transparent text-white"
          >
            {getLanguageName(selectedLanguage)}
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

'use client'

import { LanguageContext } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations/translations'
import { ReactNode, useState } from 'react'

type Language = 'en' | 'es'

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // set up in Spanish for Now
  const [language, setLanguage] = useState<Language>('es')

  const t = (key: string) => translations[language]?.[key] || key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

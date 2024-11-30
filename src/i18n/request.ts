import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const supportedLocales = ['en', 'es', 'fr', 'pt'] as const
type SupportedLocale = (typeof supportedLocales)[number]

function isValidLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale)
}

export default getRequestConfig(async () => {
  const cookieStore = cookies()
  const cookieLocale = cookieStore.get('locale')?.value

  let locale: SupportedLocale = 'es' // Default fallback locale

  if (cookieLocale && isValidLocale(cookieLocale)) {
    locale = cookieLocale
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})

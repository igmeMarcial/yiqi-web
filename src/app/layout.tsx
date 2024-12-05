import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

const title = 'Yiqi, Bringing people together'
const description =
  'Yiqi is a platform for bringing people together through professional communities. Find your tribe, learn, grow, and connect.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: ['/og.png']
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.png']
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className="h-screen w-full dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-full`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  )
}

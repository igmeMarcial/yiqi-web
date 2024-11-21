'use client'

import { translations } from '@/lib/translations/translations'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className=" text-white py-4">
      {/* Contenedor principal, centrado y con márgenes responsivos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        {/* Izquierda: Logo y Links */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center">
          <span className="font-bold text-lg">Yiqi</span>
        </div>

        {/* Derecha: Iconos sociales */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <button
            className="p-2 rounded-full hover:bg-white hover:text-black"
            aria-label={translations.es.contactUs}
          >
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Enlace inferior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex justify-center space-x-6 text-sm">
        <Link href="#" className="hover:underline">
          {translations.es.terms}
        </Link>
        <Link href="#" className="hover:underline">
          {translations.es.privacy}
        </Link>
        <Link href="#" className="hover:underline">
          {translations.es.security}
        </Link>
      </div>
    </footer>
  )
}

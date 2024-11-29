'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Mail,
  Phone,
  Briefcase,
  Building,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  User
} from 'lucide-react'
import { ProfileWithPrivacy } from '@/schemas/userSchema'
import { translations } from '@/lib/translations/translations'

interface UserProfilePageProps {
  user: ProfileWithPrivacy
}

export default function UserProfilePage({ user }: UserProfilePageProps) {
  const router = useRouter()

  const handleEditClick = () => {
    router.push('/user/edit')
  }

  const hasLinks =
    (user.website || user.linkedin || user.x || user.instagram) &&
    (user.privacySettings.website ||
      user.privacySettings.linkedin ||
      user.privacySettings.x ||
      user.privacySettings.x)

  return (
    <div className="min-h-screen bg-black text-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#0A0A0A] rounded-lg shadow-xl overflow-hidden border border-[#1A1A1A]">
          <div className="h-32 bg-gradient-to-r from-[#00E5BE] to-[#00B894] opacity-90"></div>
          <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center">
              {user.picture && (
                <Image
                  src={user.picture}
                  alt="Foto de perfil"
                  width={128}
                  height={128}
                  className="absolute -top-16 ring-4 ring-black rounded-full"
                />
              )}
              <div className="mt-16 sm:mt-0 sm:ml-32 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {user.name}
                </h1>
                <p className="mt-1 text-xl text-[#00E5BE]">
                  {user.position || 'Sin posición'}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  {user.company || 'Sin empresa'}
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.privacySettings.email && user.email && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-[#00E5BE]" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.privacySettings.phoneNumber && user.phoneNumber && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-[#00E5BE]" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-[#00E5BE]" />
                <span>{user.position || 'Sin posición'}</span>
              </div>
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-[#00E5BE]" />
                <span>{user.company || 'Sin empresa'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-[#1A1A1A]">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <User className="w-6 h-6 mr-2 text-[#00E5BE]" />
            {translations.es.aboutMe}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {user.shortDescription || translations.es.notDescriptionAvailable}
          </p>
        </div>

        <div className="mt-8 bg-[#0A0A0A] rounded-lg shadow-lg p-6 border border-[#1A1A1A]">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            {translations.es.links}
          </h2>
          {!hasLinks ? (
            <p className="text-gray-400">{translations.es.availableLinks}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.privacySettings.website && user.website ? (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#00E5BE] hover:underline"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  {translations.es.website}
                </a>
              ) : null}
              {user.privacySettings.linkedin && user.linkedin ? (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#00E5BE] hover:underline"
                >
                  <Linkedin className="w-5 h-5 mr-2" />
                  {translations.es.linkedin}
                </a>
              ) : null}
              {user.privacySettings.x && user.x ? (
                <a
                  href={user.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#00E5BE] hover:underline"
                >
                  <Twitter className="w-5 h-5 mr-2" />
                  {translations.es.x}
                </a>
              ) : null}
              {user.instagram ? (
                <a
                  href={user.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[#00E5BE] hover:underline"
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  {translations.es.instagram}
                </a>
              ) : null}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleEditClick}
            className="px-6 py-2 bg-[#00E5BE] hover:bg-[#00B894] text-black font-semibold rounded-md transition duration-300 ease-in-out"
          >
            {translations.es.editProfile}
          </button>
        </div>
      </div>
    </div>
  )
}

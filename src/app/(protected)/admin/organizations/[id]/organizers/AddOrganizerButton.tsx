'use client'

import { useState } from 'react'
import { createOrganizer } from '@/services/actions/organizerActions'
import { searchUsers } from '@/services/actions/userActions'
import { useRouter } from 'next/navigation'
import { User } from '@prisma/client'
import { useLanguage } from '@/hooks/useLanguage'

export default function AddOrganizerButton({
  organizationId
}: {
  organizationId: string
}) {
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [role, setRole] = useState<'ADMIN' | 'VIEWER'>('VIEWER')
  const router = useRouter()
  const { t } = useLanguage()

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      const results = await searchUsers(query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setSearchQuery('')
    setSearchResults([])
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedUser) {
      setError(t('selectUserError'))
    }

    try {
      await createOrganizer({ userId: selectedUser?.id, organizationId, role })
      setShowForm(false)
      setError('')
      router.refresh()
    } catch (error) {
      console.error(error)
      setError(t('addOrganizerError'))
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {t('addOrganizer')}
      </button>
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded shadow-lg w-96"
          >
            <h2 className="text-xl font-bold mb-4">{t('addNewOrganizer')}</h2>{' '}
            {/* Traducción de "Add New Organizer" */}
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder={t('searchUsers')}
                className="w-full p-2 border rounded"
              />
              {searchResults.length > 0 && (
                <ul className="mt-2 border rounded max-h-40 overflow-y-auto">
                  {searchResults.map(user => (
                    <li
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedUser && (
              <div className="mb-4">
                <p>
                  {t('selectedUser')}: {selectedUser.name} ({selectedUser.email}
                  ) {/* Traducción de "Selected User" */}
                </p>
              </div>
            )}
            <select
              value={role}
              onChange={e => setRole(e.target.value as 'ADMIN' | 'VIEWER')}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="VIEWER">{t('viewer')}</option>
              <option value="ADMIN">{t('admin')}</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {t('add')}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
      )}
    </div>
  )
}

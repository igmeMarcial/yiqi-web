'use client'

import React, { useState, useEffect } from 'react'
import Footer from '@/components/mainLanding/Footer'
import MainLandingNav from '@/components/mainLanding/mainNav'
import PublicEventsList from '@/components/events/PublicEventsList'
import { getUser } from '@/lib/auth/lucia'
import { getPublicEvents } from '@/services/actions/event/getPublicEvents'
import SearchForm from '@/components/mainLanding/SearchForm'
import { PublicEventType } from '@/schemas/eventSchema'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  name: string
  picture: string | null
  email: string
  role: string
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [locations, setLocations] = useState<string[]>([])
  const [filteredEvents, setFilteredEvents] = useState<PublicEventType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const eventsPerPage = 8

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser()
      setUser(user)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const { events: fetchedEvents, locations: fetchedLocations } =
        await getPublicEvents({})

      const validLocations: string[] = fetchedLocations.filter(
        location => location !== null
      ) as string[]

      setLocations(validLocations)
      setFilteredEvents(fetchedEvents)
    }

    fetchData()
  }, [])

  const handleSearch = async (filters: {
    title: string
    location: string
    startDate: string
    endDate: string
    type: string
  }) => {
    const { events: fetchedEvents } = await getPublicEvents(filters)
    setFilteredEvents(fetchedEvents)
    setCurrentPage(1)
  }

  /*
  const handleFilterByType = (type: string) => {
    if (type === 'All') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => event.type === type);
      setFilteredEvents(filtered);
    }
    setCurrentPage(1);
  };*/

  const startIndex = (currentPage - 1) * eventsPerPage
  const currentEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage
  )

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
  const handlePageChange = (page: number) => setCurrentPage(page)

  return (
    <>
      <div className="fixed inset-0 h-screen w-screen -z-10 bg-black"></div>
      <MainLandingNav
        user={{ name: user?.name, picture: user?.picture as string }}
      />
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto flex flex-col lg:flex-row">
        <div className="flex-1">
          {/* <Tabs onFilter={handleFilterByType} />*/}
          <SearchForm
            onSearch={handleSearch}
            locations={locations} // Pasar las ubicaciones al formulario de búsqueda
          />
          <div className="bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mt-8" />
          <PublicEventsList showHeader={false} events={currentEvents} />
          <div className="bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          {filteredEvents.length > eventsPerPage && (
            <div className="flex justify-center space-x-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    page === currentPage
                      ? 'font-bold bg-gradient-to-r from-[#04F1FF] to-[#6de4e8] text-black hover:opacity-90 transition-opacity'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

import TicketsPage from '@/components/tickets/ticketPage/TicketPage'
import UserLayout from '@/components/user/UserLayout'
import { getUser } from '@/lib/auth/lucia'
import { profileDataSchema } from '@/schemas/userSchema'
import { getTicketsWithEvents } from '@/services/actions/tickets/ticketActions'
import { getUserProfile } from '@/services/actions/userActions'
import React from 'react'

export default async function Tickets() {
  const userCurrent = await getUser()

  if (!userCurrent?.id) {
    return <div>User not found</div>
  }

  const user = await getUserProfile(userCurrent.id)
  const tickets = await getTicketsWithEvents(userCurrent.id)

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <UserLayout userProps={profileDataSchema.parse(user)}>
        <TicketsPage tickets={tickets} />
      </UserLayout>
    </main>
  )
}

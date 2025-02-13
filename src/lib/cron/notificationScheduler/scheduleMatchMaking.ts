import prisma from '@/lib/prisma'
import { JobType } from '@prisma/client'
type MatchMakingRequired = {
  registrationId: string
  userId: string
  eventId: string
}
export async function scheduleMatchMaking() {
  const now = new Date()
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000)
  console.log('twelveHoursAgo', twelveHoursAgo)

  // Get registrations with recent check-ins and no existing matches/jobs
  const registrations = await prisma.$queryRaw<MatchMakingRequired[]>`
    SELECT 
      er.id as "registrationId",
      er."userId",
      er."eventId"
    FROM "EventRegistration" er
    INNER JOIN "Ticket" t ON er.id = t."registrationId"
    INNER JOIN "User" u ON er."userId" = u.id
    WHERE t."checkedInDate" >= ${twelveHoursAgo}
    AND t."checkedInDate" <= ${now}
    AND u.embedding IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM "NetworkingMatch" nm
      WHERE nm."registrationId" = er.id
    )
    AND NOT EXISTS (
      SELECT 1 FROM "QueueJob" qj
      WHERE (qj."userId" = er."userId" OR qj."eventId" = er."eventId")
      AND qj.type = ${JobType.MATCH_MAKING_GENERATION}::"JobType"
      AND qj.status IN ('PENDING', 'PROCESSING')
    )
    GROUP BY er.id
    HAVING COUNT(t.id) > 0
  `
  console.log(registrations)
  return registrations.map(registration => ({
    type: JobType.MATCH_MAKING_GENERATION,
    data: {
      registrationId: registration.registrationId,
      userId: registration.userId,
      eventId: registration.eventId
    },
    userId: registration.userId,
    eventId: registration.eventId
  }))
}

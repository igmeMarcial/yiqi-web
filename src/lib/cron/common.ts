import { sendUserCommunicationsForServer } from '@/services/actions/communications/sendUserCommunicationsForServer'
import { handleNotificationJob } from '@/services/notifications/handlers'
import { SendBaseMessageToUserPropsSchema } from '@/services/notifications/sendBaseMessageToUser'
import { JobType, type QueueJob } from '@prisma/client'
import { processUserFirstPartyData } from '../data/processors/processUserFirstPartyData'
import { processUserMatches } from '../data/processors/processUserMatches'
type JobHandler = (job: QueueJob) => Promise<void>

export const jobHandlers: Record<JobType, JobHandler> = {
  [JobType.SEND_USER_MESSAGE]: async job => {
    if (job.notificationType) {
      await handleNotificationJob(job)
    } else {
      const data = SendBaseMessageToUserPropsSchema.parse(job.data)
      await sendUserCommunicationsForServer(data)
    }
  },
  [JobType.PROCESS_USER_DATA]: async job => {
    if (!job.userId) {
      throw new Error(`No userId found, user id related ${job.userId}`)
    }
    await processUserFirstPartyData(job.userId)
  },
  [JobType.GENERATE_EVENT_OPEN_GRAPH]: async job => {
    console.log('GENERATE EVENT OPEN GRAPH was run, left to implement', job)
  },
  [JobType.COLLECT_USER_DATA]: async job => {
    console.log('COLLECT USER DATA was run, left to implement', job)
  },
  [JobType.MATCH_MAKING_GENERATION]: async job => {
    if (!job.userId || !job.eventId) {
      throw new Error('MATCH MAKING GENERATION job requires userId and eventId')
    }

    await processUserMatches(job.userId, job.eventId)
  }
}

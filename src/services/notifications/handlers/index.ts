import { QueueJob } from '@prisma/client'
import { sendUserEventConfirmed } from './sendUserEventConfirmed'

export async function handleNotificationJob(job: QueueJob) {
  if (job.notificationType === 'RESERVATION_CONFIRMED') {
    await sendUserEventConfirmed(job)
  }
}

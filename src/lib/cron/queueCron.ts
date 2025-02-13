'use server'

import { JobType } from '@prisma/client'
import prisma from '../prisma'
import { jobHandlers } from './common'

export async function processQueueJobs(jobId?: string) {
  const jobs = jobId
    ? [
        await prisma.queueJob.findUniqueOrThrow({
          where: { id: jobId },
          include: { user: true }
        })
      ]
    : await prisma.queueJob.findMany({
        where: {
          status: 'PENDING',
          attempts: { lt: 3 },
          type: {
            notIn: [JobType.MATCH_MAKING_GENERATION, JobType.PROCESS_USER_DATA]
          }
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        take: 10, // Process 10 jobs at a time
        include: { user: true } // Include related user data if needed
      })

  console.log('found jobsprocessQueueJobs', jobs.length)

  const results = await Promise.allSettled(
    jobs.map(async job => {
      try {
        // Update job to PROCESSING
        await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: 'PROCESSING',
            startedAt: new Date(),
            attempts: { increment: 1 }
          }
        })

        const handler = jobHandlers[job.type]
        if (!handler) {
          throw new Error(`Unsupported job type: ${job.type}`)
        }

        await handler(job)

        // Update job to COMPLETED
        await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date()
          }
        })

        return { jobId: job.id, status: 'COMPLETED' as const }
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error)

        const newStatus =
          job.attempts + 1 >= job.maxAttempts ? 'FAILED' : 'PENDING'

        // Update job to FAILED or back to PENDING
        await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: newStatus,
            failedAt: newStatus === 'FAILED' ? new Date() : null,
            error: (error as Error).message
          }
        })

        return {
          jobId: job.id,
          status: newStatus as 'FAILED' | 'PENDING',
          error: (error as Error).message
        }
      }
    })
  )

  return results
}

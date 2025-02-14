'use server'

import prisma from '@/lib/prisma'
import { scheduleMissingPayment } from './scheduleMissingPayment'
import { scheduleEventReminders } from './scheduleEventReminders'
import { scheduleMatchMaking } from './scheduleMatchMaking'

export async function notificationScheduler() {
  const paymentReminders = await scheduleMissingPayment()
  const eventReminders = await scheduleEventReminders()
  const matchMaking = await scheduleMatchMaking()

  await prisma.queueJob.createMany({
    data: [...paymentReminders, ...eventReminders, ...matchMaking]
  })
}

'use server'

import { deepMerge } from '@/lib/deepMerge'
import prisma from '@/lib/prisma'
import { userDataCollectedShema } from '@/schemas/userSchema'
import { revalidatePath } from 'next/cache'
import { scheduleUserDataProcessing } from '../networking/scheduleUserDataProcessing'
import { NetworkingData } from '@/components/profile/common'

export async function saveNetworkingProfile(
  values: NetworkingData,
  userId: string,
  processFirstPartyData = false
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw new Error(`No user found`)
  }

  let updatedData

  if (!user.dataCollected) {
    updatedData = values
  } else {
    const profile = userDataCollectedShema.parse(user.dataCollected)
    updatedData = deepMerge(profile, values)
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { dataCollected: updatedData }
    })

    if (processFirstPartyData) {
      await scheduleUserDataProcessing(userId)
    }
  } catch (error) {
    throw new Error(`Failed to update networking profile: ${error}`)
  } finally {
    revalidatePath('/', 'layout')
  }
}

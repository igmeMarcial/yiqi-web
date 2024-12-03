import { lucia } from './lib'
import prisma from '../prisma'
import { luciaUserSchema } from '@/schemas/userSchema'

export const getUserByMobileAuthToken = async (
  mobileAuthToken?: string | undefined
) => {
  if (!mobileAuthToken) {
    return null
  }

  const { session, user } = await lucia.validateSession(mobileAuthToken)

  if (!user || !session || !user.id) {
    return null
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user?.id
    },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      role: true
    }
  })

  if (!dbUser) {
    return null
  }

  return luciaUserSchema.parse(dbUser)
}

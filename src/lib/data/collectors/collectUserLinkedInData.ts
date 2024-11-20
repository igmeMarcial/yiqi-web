'user server'

import { fetchUserProfile } from '../../linkedin/fetchUserProfile'
import prisma from '../../prisma'
import { fetchUserPosts } from '../../linkedin/fetchUserPosts'
import { fetchLikedPosts } from '../../linkedin/fetchLikedPosts'

export default async function collectUserLinkedInData(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      linkedinAccessToken: {
        not: null
      }
    }
  })

  //   not sure why prisma doesnt understand that we do not allow nulls since the query above should capture that
  if (!user.linkedinAccessToken) {
    throw new Error('User does not have a LinkedIn access token')
  }

  const userLinkedInProfile = await fetchUserProfile(user.linkedinAccessToken)

  const userPosts = await fetchUserPosts(
    userLinkedInProfile.id,
    user.linkedinAccessToken
  )

  const userLikedPosts = await fetchLikedPosts(user.linkedinAccessToken)

  return {
    userLinkedInProfile,
    userPosts,
    userLikedPosts
  }
}

import { RestliClient } from 'linkedin-api-client'

export async function fetchLikedPosts(accessToken: string): Promise<unknown[]> {
  const restliClient = new RestliClient()

  try {
    const response = await restliClient.get({
      resourcePath: '/socialActions',
      queryParams: {
        q: 'likes',
        count: 100
      },
      accessToken
    })

    return response.data.elements
  } catch (error) {
    console.error('Error fetching liked posts:', error)
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 401
    ) {
      // Handle token expiration
      throw new Error('Access token expired. Please re-authenticate.')
    }
    throw error
  }
}

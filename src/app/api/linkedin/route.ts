import { AuthClient } from 'linkedin-api-client'
import prisma from '@/lib/prisma'
import { getUser } from '@/lib/auth/lucia'
import { redirect } from 'next/navigation'

export default async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const user = await getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const authClient = new AuthClient({
      clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!
    })

    // Exchange authorization code for access token
    const tokenDetails = await authClient.exchangeAuthCodeForAccessToken(
      code as string
    )

    const { access_token } = tokenDetails

    // Save user data to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        linkedinAccessToken: access_token
      }
    })

    return redirect('/profile')
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error)
    return new Response('Failed to fetch LinkedIn data', { status: 500 })
  }
}

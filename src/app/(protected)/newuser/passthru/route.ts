import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const redirectCookie = cookies().get('redirect')
  if (redirectCookie) {
    cookies().delete('redirect')
    return redirect(redirectCookie.value)
  }
  redirect('/events')
}

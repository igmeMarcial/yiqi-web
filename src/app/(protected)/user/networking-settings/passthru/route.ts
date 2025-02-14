import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  await cookies().set('redirect', '/user/networking-settings')

  return redirect('/auth')
}

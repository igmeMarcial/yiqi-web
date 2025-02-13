'use server'

import { cookies } from 'next/headers'

export async function modifyCookies(key: string, value: string | undefined) {
  if (value) {
    await cookies().set(key, value)
  } else {
    await cookies().delete(key)
  }
}

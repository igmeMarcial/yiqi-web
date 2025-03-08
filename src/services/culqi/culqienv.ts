const publicKey = process.env.NEXT_PUBLIC_CULQI_KEY
const privateKey = process.env.CULQI_PRIVATE_KEY

if (!publicKey || !privateKey) {
  throw new Error('No culqi env vars were found')
}

export const NEXT_PUBLIC_CULQI_KEY = publicKey
export const CULQI_PRIVATE_KEY = privateKey

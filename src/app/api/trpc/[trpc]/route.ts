import { appRouter } from '@/services/trpc'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { getUserByMobileAuthToken } from '@/lib/auth/getUserByMobileAuthToken'

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async ({ req }) => {
      const authHeader = req.headers.get('authorization')
      const mobileAuthToken = authHeader?.replace('Bearer ', '')

      const user = await getUserByMobileAuthToken(mobileAuthToken)

      return {
        user
      }
    },
    onError({ error, type, path, input, ctx, req }) {
      console.error('TRPC Error:', {
        error,
        type,
        path,
        input,
        ctx,
        req
      })
    }
  })
}

export { handler as GET, handler as POST }

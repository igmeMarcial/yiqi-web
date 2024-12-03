import { appRouter } from '@/services/trpc'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

async function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => {
      // Example context setup (e.g., auth)
      return {}
    },
    onError({ error, type, path, input, ctx, req }) {
      console.log('error', error)
      console.log('type', type)
      console.log('path', path)
      console.log('input', input)
      console.log('ctx', ctx)
      console.log('req', req)
    }
  })
}

export { handler as GET, handler as POST }

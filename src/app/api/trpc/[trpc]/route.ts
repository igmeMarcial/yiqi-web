import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from '@/services/trpc'
import { createContext } from '@/services/trpc/context'

// tRPC handler for Next.js App Router
export const handler = createNextApiHandler({
  router: appRouter,
  createContext,
});

export { handler as GET, handler as POST };

import { type inferAsyncReturnType } from '@trpc/server'

export const createContext = () => {
  // Example context setup (e.g., auth)
  return {}
}

export type Context = inferAsyncReturnType<typeof createContext>

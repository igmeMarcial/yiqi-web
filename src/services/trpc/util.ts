import { initTRPC } from '@trpc/server'
import { type LuciaUserType } from '@/schemas/userSchema'
import SuperJSON from 'superjson'

export type Context = {
  user: LuciaUserType | null
}

const t = initTRPC.context<Context>().create({ transformer: SuperJSON })

export const router = t.router
export const publicProcedure = t.procedure

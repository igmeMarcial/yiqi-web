import { z } from 'zod'
export const CollectUserDataJobSchema = z.object({
  userId: z.string()
})

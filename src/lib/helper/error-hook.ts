import type { Context } from 'hono'

import type { ZodError } from '@/types'

export const errorHook = (
  result: { success: boolean; error?: ZodError },
  c: Context
) => {
  if (!result.success && result.error && !c.res.body) {
    const message = result.error.message || 'Internal Server Error'

    return c.json({ error: message }, 500)
  }
}

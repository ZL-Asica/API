import { HTTPException } from 'hono/http-exception'
import type { Context, ErrorHandler } from 'hono'
import type { HTTPResponseError } from 'hono/types'

import type { ZodError } from '@/types'

export const onError: ErrorHandler = (
  error: Error | HTTPResponseError,
  c: Context
) => {
  if (error instanceof Error && error.name === 'ZodError') {
    return c.json(
      { error: 'Invalid input data', details: (error as ZodError).errors },
      400
    )
  }

  if (
    c.res.body &&
    c.res.body instanceof String &&
    c.res.body.includes('JSON')
  ) {
    return c.json({ error: error.message }, 400)
  }

  if (error instanceof HTTPException || error instanceof Error) {
    return c.json(
      {
        error: error.message,
      },
      500
    )
  }
  return c.json({ error: 'Internal Server Error' }, 500)
}

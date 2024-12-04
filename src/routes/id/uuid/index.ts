import type { Context } from 'hono'
import { createRoute } from '@hono/zod-openapi'

import { uuidResponseSchema } from './schema'

import type { ZodError } from '@/types'
import { errorResponse, jsonContent } from '@/lib/helper'

const uuidRoute = createRoute({
  tags: ['id'],
  method: 'get',
  path: '/uuid',
  responses: {
    200: jsonContent(uuidResponseSchema, 'Successfully generated UUID v4'),
    400: errorResponse('Invalid JSON body'),
    500: errorResponse('An internal error occurred during UUID generation'),
  },
})

const uuid = async (c: Context) => {
  try {
    const uuid = (
      ([1e7] as unknown as string) +
      -1e3 +
      -4e3 +
      -8e3 +
      -1e11
    ).replace(/[018]/g, (c) =>
      (
        Number(c) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
      ).toString(16)
    )

    return c.json({ uuid }, 200)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json(
        { error: 'Invalid input data', details: (error as ZodError).errors },
        400
      )
    }

    // Handle JSON parse error
    if (error instanceof Error && error.message.includes('JSON')) {
      return c.json({ error: error.message }, 400)
    }

    // Handle internal server error
    return c.json(
      { error: 'An internal error occurred during UUID generation' },
      500
    )
  }
}

export { uuidRoute, uuid }

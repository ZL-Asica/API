import type { Context } from 'hono'
import { createRoute } from '@hono/zod-openapi'

import { generateSchema, generateResponseSchema } from './schema'

import { generateHash } from '@/utils'
import type { ZodError } from '@/types'
import { errorResponse, jsonContent, jsonContentRequired } from '@/lib/helper'

const generateRoute = createRoute({
  tags: ['id'],
  method: 'post',
  path: '/generate',
  request: {
    body: jsonContentRequired(generateSchema, 'inputValues'),
  },
  responses: {
    200: jsonContent(
      generateResponseSchema,
      'Successfully generated unique ID with timestamp'
    ),
    400: errorResponse('Invalid JSON body'),
    500: errorResponse('An internal error occurred during ID generation'),
  },
})

const generate = async (c: Context) => {
  try {
    const requestBody = await c.req.json()

    // Validate and parse request body
    const request = await generateSchema.parseAsync(requestBody).catch(() => {
      throw new Error('Invalid JSON body')
    })

    const { inputValues, bias, length } = request
    const timestamp = Date.now()

    // Generate unique hash
    const encoder = new TextEncoder()
    const uniqueIdInput = encoder.encode(
      inputValues.join('') + bias + timestamp
    )
    const hash = await generateHash(uniqueIdInput)

    // Return success response
    return c.json({ id: hash.slice(0, length || 6), timestamp }, 200)
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
      { error: 'An internal error occurred during ID generation' },
      500
    )
  }
}

export { generateRoute, generate }

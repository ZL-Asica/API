import type { Context } from 'hono'
import { createRoute } from '@hono/zod-openapi'

import {
  generateIdSchema,
  generateIdResponseSchema,
} from './generate-id.schema'

import { generateHash } from '@/utils'
import { errorResponse, jsonContent, jsonContentRequired } from '@/lib/helper'

const generateIdRoute = createRoute({
  tags: ['tools'],
  method: 'post',
  path: '/generate-id',
  request: {
    body: jsonContentRequired(generateIdSchema, 'inputValues'),
  },
  responses: {
    200: jsonContent(
      generateIdResponseSchema,
      'Successfully generated unique ID with timestamp'
    ),
    400: errorResponse('Invalid JSON body'),
    500: errorResponse('An internal error occurred during ID generation'),
  },
})

const generateId = async (c: Context) => {
  try {
    const requestBody = await c.req.json()

    // Validate and parse request body
    const request = await generateIdSchema.parseAsync(requestBody).catch(() => {
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
    console.error('Error during ID generation:', error)

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

export { generateIdRoute, generateId }

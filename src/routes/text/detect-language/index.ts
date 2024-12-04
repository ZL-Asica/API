import type { Context } from 'hono'
import { createRoute } from '@hono/zod-openapi'

import { detectLanguageSchema, detectLanguageResponseSchema } from './schema'

import type { ZodError } from '@/types'
import { errorResponse, jsonContent, jsonContentRequired } from '@/lib/helper'
import { detectLanguage } from '@/utils'

const detectLanguageRoute = createRoute({
  tags: ['text'],
  method: 'post',
  path: '/detect-language',
  request: {
    body: jsonContentRequired(detectLanguageSchema, 'Text to detect language'),
  },
  responses: {
    200: jsonContent(
      detectLanguageResponseSchema,
      'Successfully detected language'
    ),
    400: errorResponse('Invalid JSON body'),
    500: errorResponse('An internal error occurred during language detection'),
  },
})

const detectLanguageHandler = async (c: Context) => {
  try {
    const { text } = await c.req.json()

    if (!text) {
      return c.json({ error: 'Text is required' }, 400)
    }

    const lang = detectLanguage(text)

    return c.json({ language: lang }, 200)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json(
        { error: 'Invalid input data', details: (error as ZodError).errors },
        400
      )
    }

    if (error instanceof Error && error.message.includes('JSON')) {
      return c.json({ error: error.message }, 400)
    }

    return c.json(
      { error: 'An internal error occurred during language detection' },
      500
    )
  }
}

export { detectLanguageRoute, detectLanguageHandler }

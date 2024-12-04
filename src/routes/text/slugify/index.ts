import type { Context } from 'hono'
import { createRoute } from '@hono/zod-openapi'
import { pinyin } from 'pinyin-pro'

import { slugifySchema, slugifyResponseSchema } from './schema'

import type { ZodError } from '@/types'
import { errorResponse, jsonContent, jsonContentRequired } from '@/lib/helper'
import { detectLanguage } from '@/utils'

const slugifyRoute = createRoute({
  tags: ['text'],
  method: 'post',
  path: '/slugify',
  request: {
    body: jsonContentRequired(slugifySchema, 'Text to slugify'),
  },
  responses: {
    200: jsonContent(
      slugifyResponseSchema,
      'Successfully generated slug from text'
    ),
    400: errorResponse('Invalid JSON body'),
    500: errorResponse('An internal error occurred during slug generation'),
  },
})

const slugify = async (c: Context) => {
  try {
    const { text } = await c.req.json()

    if (!text) {
      return c.json({ error: 'Text is required' }, 400)
    }

    // Split text into parts based on non-Chinese characters
    const parts =
      text.normalize('NFKD').match(/[\u4E00-\u9FA5]+|[^\u4E00-\u9FA5]+/g) || []

    const slug = parts
      .map((part: string) => {
        return detectLanguage(part) === 'cmn'
          ? pinyin(part, { toneType: 'none', type: 'array' })
              .filter(Boolean)
              .join('-')
          : part
              .trim()
              .replace(/[^\d\sA-Za-z-]+/g, '')
              .replace(/\s+/g, '-')
              .toLowerCase()
      })
      .filter(Boolean)
      .join('-')

    // Remove leading and trailing hyphens
    const cleanedSlug = slug.replace(/^-+|-+$/g, '')

    // Return success response
    return c.json({ slug: cleanedSlug }, 200)
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

export { slugifyRoute, slugify }

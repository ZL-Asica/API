import type { Context } from 'hono'
import { createRoute } from '@hono/zod-openapi'

import { randomPasswordSchema, randomPasswordResponseSchema } from './schema'

import type { ZodError } from '@/types'
import { errorResponse, jsonContent } from '@/lib/helper'

const randomPasswordRoute = createRoute({
  tags: ['security'],
  method: 'post',
  path: '/random-password',
  request: {
    body: jsonContent(randomPasswordSchema, 'inputValues'),
  },
  responses: {
    200: jsonContent(
      randomPasswordResponseSchema,
      'Successfully generated random password'
    ),
    400: errorResponse('Invalid JSON body'),
    500: errorResponse('An internal error occurred during password generation'),
  },
})

const formatPasswordWithSeparator = (
  password: string,
  segmentLength: number = 6,
  separator: string = '-'
): string => {
  const segments: string[] = []
  const passwordChars = [...password]
  let currentSegment = ''

  for (let index = 0; index < passwordChars.length; index++) {
    currentSegment += passwordChars[index]

    if (
      (index + 1) % segmentLength === 0 ||
      index === passwordChars.length - 1
    ) {
      segments.push(currentSegment)
      currentSegment = ''
    }
  }

  return segments.join(separator)
}

const generateReadablePassword = async (
  length: number,
  type: 'alphanumeric' | 'numeric' | 'alphanumeric-special',
  segmentLength: number = 6,
  separator: string = '-'
): Promise<string> => {
  const charSets = {
    alphanumeric: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789',
    numeric: '23456789',
    'alphanumeric-special':
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*()_+=[]{}.<>?',
  }

  const charSet = charSets[type]
  if (!charSet) {
    throw new Error('Invalid password type provided')
  }

  let password = ''
  for (let index = 0; index < length; index++) {
    const randomIndex = Math.floor(Math.random() * charSet.length)
    password += charSet[randomIndex]
  }

  return formatPasswordWithSeparator(password, segmentLength, separator)
}

const randomPassword = async (c: Context) => {
  try {
    const { length = 16, type = 'alphanumeric-special' } = await c.req.json()
    const password = await generateReadablePassword(length, type)

    return c.json({ password }, 200)
  } catch (error) {
    // Handle JSON parse error
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json(
        { error: 'Invalid input data', details: (error as ZodError).errors },
        400
      )
    }

    // Handle internal server error
    return c.json(
      { error: 'An internal error occurred during Random Password generation' },
      500
    )
  }
}

export { randomPasswordRoute, randomPassword }

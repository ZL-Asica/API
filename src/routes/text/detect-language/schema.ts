import { z } from '@hono/zod-openapi'

const detectLanguageSchema = z.object({
  text: z.string().min(6, 'Text must be more than 5 characters long').openapi({
    example: 'This is an example',
    description: 'The text for which the language will be detected.',
  }),
})

const detectLanguageResponseSchema = z.object({
  language: z.string().openapi({
    example: 'eng',
    description:
      'The detected language as an ISO 639-3 language code. For example, "cmn" for Mandarin Chinese, "eng" for English.',
  }),
})

export { detectLanguageSchema, detectLanguageResponseSchema }

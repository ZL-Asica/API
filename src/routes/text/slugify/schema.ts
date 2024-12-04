import { z } from '@hono/zod-openapi'

const slugifySchema = z.object({
  text: z.string().min(1, 'Text cannot be empty').openapi({
    example: 'This is a 栗子～',
    description:
      'The text to be converted into a URL-friendly slug. Supports English, Chinese, and other languages.',
  }),
})

const slugifyResponseSchema = z.object({
  slug: z.string().openapi({
    example: 'this-is-a-li-zi',
    description:
      'The generated URL-friendly slug. For Chinese, the slug is based on pinyin. For other languages, special characters are removed or transliterated.',
  }),
})

export { slugifySchema, slugifyResponseSchema }

import { z } from '@hono/zod-openapi'

const randomPasswordSchema = z.object({
  length: z
    .number()
    .int()
    .min(8, { message: 'Password length must be at least 8 characters.' })
    .max(256, { message: 'Password length cannot exceed 256 characters.' })
    .default(16)
    .optional()
    .openapi({
      example: 16,
      description:
        'Length of the password to be generated (between 8 and 256).',
    }),
  type: z
    .enum(['alphanumeric', 'numeric', 'alphanumeric-special'])
    .default('alphanumeric-special')
    .optional()
    .openapi({
      example: 'alphanumeric-special',
      description:
        "Type of password to generate: 'alphanumeric', 'numeric', or 'alphanumeric-special'.",
    }),
})

const randomPasswordResponseSchema = z.object({
  password: z.string().openapi({
    example: 'P@ssw0rd123!',
    description: 'The randomly generated password.',
  }),
})

export { randomPasswordSchema, randomPasswordResponseSchema }

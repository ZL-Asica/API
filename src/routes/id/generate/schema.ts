import { z } from '@hono/zod-openapi'

const generateSchema = z.object({
  inputValues: z
    .array(z.string().min(1, 'Strings cannot be empty'))
    .min(1, 'Array must have at least one string')
    .openapi({
      example: ['input', 'values'],
    }),
  bias: z
    .string()
    .default(() => Math.random().toString(36) + Math.random().toString(36))
    .optional()
    .openapi({ example: 'random' }),
  length: z.number().int().min(1).max(64).optional().openapi({ example: 10 }),
})

const generateResponseSchema = z.object({
  id: z.string().openapi({ example: 'f47ac10bd2' }),
  timestamp: z.number().int().openapi({ example: 1_631_530_000_000 }),
})

export { generateSchema, generateResponseSchema }

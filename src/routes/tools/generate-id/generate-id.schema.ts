import { z } from '@hono/zod-openapi'

const generateIdSchema = z.object({
  inputValues: z
    .array(z.string().min(1, 'Strings cannot be empty'))
    .min(1, 'Array must have at least one string'),
  bias: z
    .string()
    .default(() => Math.random().toString(36) + Math.random().toString(36))
    .optional(),
  length: z.number().int().min(1).max(64).optional(),
})

const generateIdResponseSchema = z.object({
  id: z.string(),
  timestamp: z.number().int(),
})

export { generateIdSchema, generateIdResponseSchema }

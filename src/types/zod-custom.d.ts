import type { z } from '@hono/zod-openapi'

type ZodSchema = z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>
type ZodError = z.ZodError

export type { ZodSchema, ZodError }

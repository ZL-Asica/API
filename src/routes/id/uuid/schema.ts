import { z } from '@hono/zod-openapi'

const uuidResponseSchema = z.object({
  uuid: z.string().openapi({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }),
})

export { uuidResponseSchema }

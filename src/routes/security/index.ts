import { OpenAPIHono } from '@hono/zod-openapi'

import { randomPasswordRoute, randomPassword } from './random-password'

import { errorHook } from '@/lib/helper'

const security = new OpenAPIHono().openapi(
  randomPasswordRoute,
  randomPassword,
  errorHook
)

export default security

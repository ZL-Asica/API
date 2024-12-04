import { OpenAPIHono } from '@hono/zod-openapi'

import { generateRoute, generate } from './generate'
import { uuidRoute, uuid } from './uuid'

import { errorHook } from '@/lib/helper'

const id = new OpenAPIHono()
  .openapi(generateRoute, generate, errorHook)
  .openapi(uuidRoute, uuid, errorHook)

export default id

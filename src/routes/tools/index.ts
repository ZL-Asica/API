import { OpenAPIHono } from '@hono/zod-openapi'

import { generateIdRoute, generateId } from './generate-id'

import { errorHook } from '@/lib/helper'

const tools = new OpenAPIHono().openapi(generateIdRoute, generateId, errorHook)

export default tools

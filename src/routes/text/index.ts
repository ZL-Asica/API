import { OpenAPIHono } from '@hono/zod-openapi'

import { slugifyRoute, slugify } from './slugify'
import { detectLanguageRoute, detectLanguageHandler } from './detect-language'

import { errorHook } from '@/lib/helper'

const text = new OpenAPIHono()
  .openapi(slugifyRoute, slugify, errorHook)
  .openapi(detectLanguageRoute, detectLanguageHandler, errorHook)

export default text

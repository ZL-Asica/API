import type { Context } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { poweredBy } from 'hono/powered-by'
import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'

import id from '@/routes/id'
import security from '@/routes/security'
import { notFound, onError } from '@/middlewares'

const app = new OpenAPIHono()

app.use(poweredBy({ serverName: 'ZL Asica with Hono' }))
app.use(
  secureHeaders({
    crossOriginEmbedderPolicy: false, // no COEP
    crossOriginResourcePolicy: false, // no CORP
    crossOriginOpenerPolicy: 'unsafe-none', // allow cross-origin opener
    xContentTypeOptions: 'nosniff', // nosniff for content/type
    xPermittedCrossDomainPolicies: false, // Turn off cross-domain policy
  })
)
// app.use(workerLogger)
app.notFound(notFound)
app.onError(onError)

app.get('/favicon.ico', (c: Context) => {
  return c.redirect('https://www.zla.app/favicon.ico')
})

app.route('/id', id)
app.route('/security', security)

// Set OpenAPI documentation
app.doc31('/doc', {
  openapi: '3.1.0',
  info: {
    title: 'ZLA API',
    version: '0.0.2',
  },
})

// Interactive API reference
app.get(
  '/',
  apiReference({
    pageTitle: 'ZLA API Reference',
    favicon: 'https://www.zla.app/favicon.ico',
    metaData: {
      title: 'ZLA API Reference',
      description: 'API reference for ZLA',
      ogDescription: 'API reference for ZLA',
      ogTitle: 'ZLA API Reference',
      robots: 'noindex, nofollow',
    },
    theme: 'kepler',
    hideModels: true,
    spec: {
      url: '/doc',
    },
  })
)

export default app

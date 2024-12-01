import type { Context, NotFoundHandler } from 'hono'

export const notFound: NotFoundHandler = (c: Context) => {
  return c.json({ error: `Not Found - ${c.req.path}` }, 404)
}

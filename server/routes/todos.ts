import { z } from 'zod'
import { defineRoute } from 'theokit/server'

/**
 * In-memory todo CRUD. Demonstrates Zod schema validation + per-request
 * persistence. Real apps would swap the Map for @theokit/orm + drizzle.
 */
interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: string
}

const store = new Map<string, Todo>()

const createSchema = z.object({
  text: z.string().min(1).max(280),
})

const patchSchema = z.object({
  done: z.boolean().optional(),
  text: z.string().min(1).max(280).optional(),
})

export const GET = defineRoute({
  handler: () => ({
    items: Array.from(store.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    count: store.size,
  }),
})

export const POST = defineRoute({
  input: createSchema,
  handler: ({ body }) => {
    const id = `todo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const item: Todo = {
      id,
      text: body.text,
      done: false,
      createdAt: new Date().toISOString(),
    }
    store.set(id, item)
    return { item }
  },
})

export const PATCH = defineRoute({
  input: patchSchema,
  handler: ({ body, request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (id === null || !store.has(id)) {
      return new Response(JSON.stringify({ error: 'not found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      })
    }
    const existing = store.get(id)!
    const updated = { ...existing, ...body }
    store.set(id, updated)
    return { item: updated }
  },
})

export const DELETE = defineRoute({
  handler: ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (id === null || !store.has(id)) {
      return new Response(JSON.stringify({ error: 'not found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      })
    }
    store.delete(id)
    return { deleted: id }
  },
})

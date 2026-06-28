import { defineRoute } from 'theokit/server'

/**
 * RED TEAM probe for theo-cloud#107 (edge writeTimeout vs SSE).
 * A REAL Server-Sent Events stream: sends the text/event-stream header +
 * an initial comment immediately, then stays idle for 70s (gap > 60s, no
 * keep-alive) before the first data event.
 *
 * If the edge is SSE-aware (exempts text/event-stream from writeTimeout),
 * curl stays connected past 60s and receives `data: {"tick":1}` at ~70s.
 * If the edge still cuts at ~60s, #107 is NOT fixed for real SSE either.
 */
export const GET = defineRoute({
  handler: () => {
    const enc = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(enc.encode(': sse-connected (redteam-107)\n\n'))
        setTimeout(() => {
          controller.enqueue(enc.encode('data: {"tick":1,"atSeconds":70}\n\n'))
          controller.close()
        }, 70000)
      },
    })
    return new Response(stream, {
      headers: {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        connection: 'keep-alive',
      },
    })
  },
})

import { defineRoute } from 'theokit/server'

/**
 * Readiness probe — separate from /health (liveness) so K8s can distinguish
 * "process is alive" from "process is ready to receive traffic". For this
 * demo readiness simply confirms a critical env var (LLM key) is present.
 */
export const GET = defineRoute({
  handler: () => {
    const llmKey =
      process.env.OPENROUTER_API_KEY ??
      process.env.OPENAI_API_KEY ??
      process.env.ANTHROPIC_API_KEY ??
      null
    if (llmKey === null) {
      return new Response(
        JSON.stringify({ ready: false, reason: 'no LLM API key configured' }),
        { status: 503, headers: { 'content-type': 'application/json' } },
      )
    }
    return { ready: true }
  },
})

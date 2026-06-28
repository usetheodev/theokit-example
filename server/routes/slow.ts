import { defineRoute } from 'theokit/server'

/**
 * RED TEAM probe for theo-cloud#107 (edge writeTimeout=60s on client apps).
 * Holds the response open for 70s (no intermediate writes), then replies.
 * If the Traefik edge writeTimeout=60s is in effect, the connection is cut
 * at ~60s before this responds. If the app's edge tolerates long-lived
 * responses, curl receives {ok:true,sleptMs:70000} after ~70s.
 */
export const GET = defineRoute({
  handler: async () => {
    const sleptMs = 70000
    await new Promise((resolve) => setTimeout(resolve, sleptMs))
    return { ok: true, sleptMs, note: 'redteam-107-probe' }
  },
})

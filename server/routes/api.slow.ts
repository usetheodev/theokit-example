import { defineRoute } from 'theokit/server'

// Red Team theo-cloud#107 LIVE-PROOF (b) regression-protector endpoint.
// Sleeps for `?sleep=<seconds>` (capped at 300 — matches Traefik
// writeTimeout=300s ceiling) then returns canonical {ok:true} payload.
// Used by infra/tests/e2e/dev-public-customer-app-respondingtimeouts_test.sh
// to prove the customer-app entryPoint no longer cuts long responses at
// ~61s post the writeTimeout=60s → 300s bump in
// theo/infra/helm/traefik/values.yaml.
export const GET = defineRoute({
  handler: async (req: Request) => {
    const url = new URL(req.url)
    const rawSleep = url.searchParams.get('sleep') ?? '0'
    const sleep = Math.min(Math.max(parseInt(rawSleep, 10) || 0, 0), 300)
    if (sleep > 0) {
      await new Promise((resolve) => setTimeout(resolve, sleep * 1000))
    }
    return { ok: true, slept: sleep }
  },
})

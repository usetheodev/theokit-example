import { defineRoute } from 'theokit/server'

/**
 * Build metadata endpoint — surfaces commit SHA + build time so operators
 * can confirm which version of the app is serving traffic. Populated at
 * build time by the theokit pipeline.
 */
export const GET = defineRoute({
  handler: () => ({
    name: 'theokit-example',
    version: '0.1.0',
    commit: process.env.COMMIT_SHA ?? 'dev',
    builtAt: process.env.BUILD_TIME ?? new Date().toISOString(),
    runtime: 'node',
  }),
})

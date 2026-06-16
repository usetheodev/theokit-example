// Canonical 2026-06-16: minimal TheoKit page — pure React, no @theokit/ui
// or @theokit/sdk. Used for end-to-end deploy validation (TheoKit -> TheoCloud).

export default function Page() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>TheoKit example</h1>
      <p>This is the canonical TheoKit-native fixture for TheoCloud deploy validation.</p>
      <ul>
        <li><a href="/api/health">/api/health</a> — liveness</li>
        <li><a href="/api/version">/api/version</a> — build metadata</li>
      </ul>
    </main>
  )
}

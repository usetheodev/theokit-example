# theokit-example

Realistic TheoKit demo application — chat with real LLM (OpenRouter / OpenAI / Anthropic), todos CRUD, version + ready + health endpoints. Exercises the full deploy pipeline end-to-end:

```
theokit build → .theo/services.json v2 → @theo/cli deploy → TheoCloud → live HTTP 200
```

> 📚 **TheoKit docs:** https://docs.theokit.dev

## Surface

### Pages
- `/` — chat surface (Theo Agent), streaming SSE via `useAgentStream`, `⌘K` command palette, context-window bar.

### API endpoints

| Path | Method | Purpose |
|------|--------|---------|
| `/api/health` | GET | Liveness probe (returns `{ ok: true }`). |
| `/api/ready` | GET | Readiness probe (200 when LLM key present, 503 otherwise). |
| `/api/version` | GET | Build metadata (commit SHA, build time, runtime). |
| `/api/chat` | POST | LLM chat, SSE-streaming. Provider auto-resolved from env. |
| `/api/todos` | GET / POST / PATCH / DELETE | In-memory todo CRUD with Zod validation. |

## Local dev

```bash
# Requires Node 22+
npm install

# (optional) provider key for the chat endpoint
echo 'OPENROUTER_API_KEY=sk-or-v1-…' > .env

npm run dev    # theokit dev — opens http://localhost:3000
```

## Build

```bash
# Emits .theo/services.json v2 (per Plan v1.2 T2.1 — top-level `name` in
# theo.config.ts populates the `project` field).
npm run build
```

After build:

```bash
$ jq '. | {version, project}' .theo/services.json
{
  "version": 2,
  "project": "theokit-example"
}
```

## Deploy (TheoCloud)

```bash
# One-shot zero-config (Plan v1.1 T4.1 — `theo` no-args delegates to deploy
# and auto-invokes `theokit build` if .theo/services.json is missing):
theo

# Or the explicit two-step (CI-style):
npm run build
theo deploy --prebuilt
```

Both paths land at `POST /api/v1/source/upload` (multipart: `services_json`
first, `bundle` second per Plan v1.2 T6.1 wire contract). The TheoCloud API
validates the schema + DNS-1123 + reserved env keys, then the build pipeline
materializes K8s manifests + ArgoCD sync to the workload cluster.

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `OPENROUTER_API_KEY` | — | Preferred LLM gateway (routes to OpenAI / Anthropic / Mistral / etc.). |
| `OPENAI_API_KEY` | — | Direct OpenAI fallback if no OpenRouter. |
| `ANTHROPIC_API_KEY` | — | Direct Anthropic fallback. |
| `THEO_TOKEN` | — | TheoCloud auth (CI only — `theo login` is the local-dev flow). |
| `THEOKIT_BUILD_TIMEOUT_MS` | `600000` | Override the `theokit build` subprocess timeout (Plan v1.1 ADR D7). |

## Project structure

```
app/
├── page.tsx           /              — chat composer (TheoUI agent surface)
├── layout.tsx         wrapper        — TheoUI provider + theme
server/
├── routes/
│   ├── chat.ts        POST /api/chat    — LLM SSE stream
│   ├── health.ts      GET  /api/health  — liveness
│   ├── ready.ts       GET  /api/ready   — readiness (gated on LLM key)
│   ├── version.ts     GET  /api/version — build metadata
│   └── todos.ts       /api/todos        — Zod-validated CRUD
├── crons/
│   └── cleanup-conversations.ts   — periodic cleanup task
theo.config.ts          name: 'theokit-example' (triggers v2 emit)
.theo/services.json     emitted by build (gitignored)
```

## What this demo proves

- `theokit build --target theo-cloud` emits a valid services.json v2 with the project identifier from `theo.config.ts`.
- `@theo/cli` Plan v1.1 zero-config (`theo` no-args) auto-invokes `theokit build` when `.theo/services.json` is missing.
- Plan v1.2 wire contract (multipart field order + per-field caps + DNS-1123) is honored end-to-end.
- TheoCloud receives a valid v2 manifest, validates it, and the live endpoints serve HTTP 200 on `/api/health`, `/api/ready`, `/api/version`.

## License

Apache 2.0

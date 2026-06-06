import { defineConfig } from 'theokit'

// Plan v1.2 T2.1 — top-level `name` triggers services.json v2 emit with the
// `project` field populated. Without `name`, the build emits v1 (deprecated,
// services-bundle fallback at TheoCloud).
export default defineConfig({
  name: 'theokit-example',
})

import { defineConfig } from 'theokit'

// TEMPORARY 2026-06-18 — Tracked in upstream issue
// https://github.com/usetheodev/theokit/issues/9: theokit@0.6.0 builder
// emits services.json v2 when `name` is set, but the TheoCloud adapter
// still hard-rejects anything that is not v1. Until #9 is fixed, we
// use the documented v1 path (no top-level `name`) with services
// declared explicitly so services.json carries a populated `services[]`
// instead of being empty.
export default defineConfig({})

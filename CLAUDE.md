# CLAUDE.md

Guidance for working in this repo.

## What this is

**gökberk tools** — a precision cutting-tools storefront built with **SvelteKit**, and the flagship
**consumer / dogfooding** app for the [`@gokberknur/design-system`](https://www.npmjs.com/package/@gokberknur/design-system)
package. Every screen is composed from `gok-*` web components and `--gok-*` tokens. This repo is
**public**; the design-system *source* repo is private (only its built `dist/` is on npm).

It is a pure client **SPA** (`adapter-static`, `ssr = false` in `src/routes/+layout.ts`) because the
`gok-*` elements are web components that register and render in the browser.

## Two authorities

1. **Svelte MCP governs how the code is written.** Author and edit **every** `.svelte` / `.svelte.ts` /
   `.svelte.js` file through the Svelte MCP (the `svelte:svelte-file-editor` agent): it pulls current
   Svelte 5 docs and runs the autofixer to validate the code, re-checking after each change. Do **not**
   hand-write Svelte from memory — Svelte 5 runes + web-component interop have sharp edges.
2. **The `gokberk-design` skill governs how it looks and reads.** Compose every route against its
   `patterns.md`, `brand-language.md`, `voice-and-tone.md`; hold it against `verification.md` before
   calling it done.

## Brand discipline (non-negotiable)

- **Never hardcode** a hex, px, radius, or easing curve — read a `--gok-*` token (a *semantic role*:
  `--gok-color-text`/`-surface`/`-primary`/`-border`, `--gok-space-*`, …). This is what makes
  light/dark, density, and AAA contrast work for free.
- **Build with `gok-*` components first.** Drop to raw tokens + HTML only when no component fits.
- Monochrome canvas; the **forest-green accent is spent once per context** (primary action / selected /
  focus / link). Hairline + flat — **no shadow as a border**, no shadowed resting surfaces.
- The **mono uppercase eyebrow** is the one intentional uppercase. Left-aligned, **sentence-case**
  copy. Status by rule + icon + text, never colour alone. Logical CSS properties throughout.

## Web-component ↔ Svelte interop (the tricky part — see `src/lib/wc.svelte.ts`)

- **Registration is client-only.** `src/lib/gok.ts` imports the per-element side-effect subpaths
  (`@gokberknur/design-system/gok-button`, …); it's imported once from the root `+layout.svelte`.
- **Objects/arrays must be set as DOM *properties*, not attributes.** Svelte sets attributes on custom
  elements by default; for `gok-table`'s `columns`/`rows` (and any object/array prop) assign the
  property via the `setProps` action / an `$effect` in `src/lib/wc.svelte.ts`.
- **Hyphenated custom events** (`gok-page-change`, `gok-selection-change`, `gok-sort`, `change`, …):
  attach with `addEventListener` via the `on` action in `src/lib/wc.svelte.ts`, not framework event sugar.
- No `bind:value` on custom elements — read values from `change`/`input` events, set back explicitly.
- Slots into shadow DOM (`slot="actions"`, `slot="media"`, …) work with plain `slot="…"`.

## Dependency modes

- **Prod / clone / CI**: depends on `@gokberknur/design-system` from npm (`^0.4.x`, kept current by
  Renovate). The **deployed store may only use published APIs.**
- **Local dogfooding**: `npm link` the local design system (`resolve.dedupe: ['lit']` handles the Lit
  duplication). See README. Work that uses unpublished components stays on a feature branch until the
  matching release ships.

## Cross-repo sync

- This repo: `renovate.json` watches the package; `.github/workflows/ci.yml` builds + checks + runs a
  Playwright consumer suite on each bump PR.
- The design-system repo runs a **non-blocking** consumer-report job (packs the candidate, installs it
  here, runs these tests) so a breaking change is reported before publish — but never gates it.

## Commands

```bash
npm run dev / build / preview / check / test:e2e
```

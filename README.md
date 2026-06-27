# gökberk tools

A precision cutting-tools storefront — carbide inserts, drills, mills, and holders that hold
tolerance, shift after shift. Built with **SvelteKit**, it is the flagship showcase (and dogfooding
consumer) for the [**@gokberknur/design-system**](https://www.npmjs.com/package/@gokberknur/design-system)
component library: `gok-*` web components, `--gok-*` tokens, a monochrome canvas with one earned
forest-green accent.

## Stack

- **SvelteKit** + `adapter-static` — a prerendered/SPA static site, deployable to any static host
  (Cloudflare Pages, Vercel, …) with no server.
- **@gokberknur/design-system** (from npm) — every UI element is a `gok-*` web component reading
  `--gok-*` tokens; the store never hardcodes a colour, radius, or font.

## Develop

```bash
npm install        # resolves @gokberknur/design-system from the public npm registry
npm run dev        # Vite dev server
npm run build      # static build → ./build
npm run preview    # serve the build
npm run check      # svelte-check / typecheck
```

## Dogfooding (local design-system development)

The store depends on the **published** package by default. To develop the store against a **local**
checkout of the design system (including unpublished components), link them:

```bash
# in the design system repo (build first so the package's exports resolve):
npm run build:lib
npm link

# in this repo:
npm link @gokberknur/design-system
npm run dev
```

`vite.config.ts` sets `resolve.dedupe: ['lit']` so the linked package shares a single Lit instance
(otherwise custom elements double-register). Unlink with `npm unlink @gokberknur/design-system &&
npm install` to return to the published package.

> **Deploy uses published APIs only.** You can build against unpublished components locally, but a
> route that depends on one cannot ship to the public site until the matching design-system release is
> on npm. Keep such work on a feature branch until then.

## Related

- Design system package: <https://www.npmjs.com/package/@gokberknur/design-system>
- Home: <https://gokberk.se>

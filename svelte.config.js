import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * gökberk tools is a pure client SPA (see src/routes/+layout.ts: ssr=false).
 * The gok-* elements are web components that register in the browser, so there is
 * nothing to gain from SSR — adapter-static with a fallback serves every route
 * (including dynamic /product/[slug], /order/[id], /journal/[slug]) as one shell.
 *
 * @type {import('@sveltejs/kit').Config}
 */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: false,
    }),
  },
};

export default config;

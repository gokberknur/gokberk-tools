import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    // The gok-* components are Lit elements. When the design system is linked
    // locally (npm link, for dogfooding) two copies of Lit can end up in the
    // graph, which breaks custom-element registration ("already defined").
    // Deduping keeps a single Lit instance in dev and in prod.
    dedupe: ['lit'],
  },
});

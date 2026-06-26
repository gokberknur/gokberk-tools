// Pure client SPA: the gok-* web components register and render in the browser,
// so server-side rendering is disabled (it would only emit empty custom-element
// shells and risk "customElements is not defined"). adapter-static + fallback
// (svelte.config.js) serves every route, including dynamic params.
export const ssr = false;
export const prerender = false;

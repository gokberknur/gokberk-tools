<script lang="ts">
	import '../app.css';
	import '@gokberknur/design-system/standalone.css';
	import '$lib/gok';

	let { children } = $props();
</script>

<div class="app">
	<header class="app__chrome">gökberk tools</header>
	<main class="app__main">{@render children()}</main>
	<footer class="app__chrome">© 2026 gökberk tools</footer>
</div>

<style>
	.app__chrome {
		padding-block: var(--gok-space-400);
		padding-inline: var(--gok-space-500);
		color: var(--gok-color-text-muted);
		font-family: var(--gok-type-eyebrow-family);
		font-size: var(--gok-type-eyebrow-size);
		letter-spacing: var(--gok-type-eyebrow-tracking);
		text-transform: uppercase;
	}

	header.app__chrome {
		border-block-end: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	footer.app__chrome {
		border-block-start: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}
</style>

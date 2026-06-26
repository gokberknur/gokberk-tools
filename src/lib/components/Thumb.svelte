<script lang="ts">
	import type { CategoryId } from '$lib/data';

	let { category, ratio = '4 / 3' }: { category: CategoryId; ratio?: string } = $props();
</script>

<!--
	The storefront's signature media treatment: a faint engineering-drawing grid
	with a single hairline line-art motif per tool family. Monochrome, with one
	accent stroke — the blueprint reading, not a photo. All values are tokens.
-->
<div class="thumb" style="--ratio: {ratio};" aria-hidden="true">
	<svg viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1.5">
		{#if category === 'turning'}
			<!-- Turning insert: a rhombus with a nose radius. -->
			<path d="M60 18 L96 45 L60 72 L24 45 Z" />
			<circle cx="60" cy="45" r="9" class="accent" />
			<path d="M24 45 H8 M112 45 H96" stroke-dasharray="3 4" />
		{:else if category === 'milling'}
			<!-- End mill: a fluted cylinder. -->
			<rect x="46" y="16" width="28" height="58" rx="2" />
			<path d="M46 28 L74 22 M46 40 L74 34 M46 52 L74 46 M46 64 L74 58" />
			<path d="M60 74 L60 84" class="accent" />
		{:else if category === 'drilling'}
			<!-- Drill: a pointed body with twin flutes. -->
			<path d="M48 16 H72 V60 L60 78 L48 60 Z" />
			<path d="M54 22 V58 M66 22 V58" />
			<path d="M60 78 L60 86" class="accent" />
		{:else if category === 'threading'}
			<!-- Threading: a helix down an axis. -->
			<path d="M60 14 V76" class="accent" />
			<path d="M44 22 C76 28 76 28 76 34 C44 40 44 40 44 46 C76 52 76 52 76 58 C44 64 44 64 44 70" />
		{:else}
			<!-- Grooving / parting: stacked grooves. -->
			<rect x="28" y="30" width="64" height="30" rx="1" />
			<path d="M44 30 V60 M60 30 V60 M76 30 V60" />
			<path d="M28 45 H12" class="accent" stroke-dasharray="3 4" />
		{/if}
	</svg>
</div>

<style>
	.thumb {
		position: relative;
		aspect-ratio: var(--ratio, 4 / 3);
		display: grid;
		place-items: center;
		overflow: hidden;
		background-color: var(--gok-color-surface-strong);
		/* A faint blueprint grid, drawn from the border role at a soft alpha. */
		background-image:
			linear-gradient(
				to right,
				color-mix(in srgb, var(--gok-color-border) 70%, transparent) var(--gok-border-width-hairline),
				transparent var(--gok-border-width-hairline)
			),
			linear-gradient(
				to bottom,
				color-mix(in srgb, var(--gok-color-border) 70%, transparent) var(--gok-border-width-hairline),
				transparent var(--gok-border-width-hairline)
			);
		background-size: 1.25rem 1.25rem;
	}

	.thumb svg {
		inline-size: 52%;
		block-size: auto;
		color: var(--gok-color-text-muted);
	}

	/* A single ink-weight stroke for emphasis — the accent colour stays reserved
	   for actions, never spent on decoration. */
	.thumb :global(.accent) {
		stroke: var(--gok-color-text);
	}
</style>

<script lang="ts">
	import type { CategoryId } from '$lib/data';

	let { category, ratio = '4 / 3' }: { category: CategoryId; ratio?: string } = $props();
</script>

<!--
	The storefront's signature media treatment: a faint engineering-drawing grid
	with a single hairline line-art motif per tool family. Monochrome, drawn as a
	blueprint reading rather than a photo — ink line work, faint dimension lines,
	and exactly one ink accent stroke per drawing. All values are tokens.
-->
<div class="thumb" style="--ratio: {ratio};" aria-hidden="true">
	<svg viewBox="0 0 240 180" fill="none" aria-hidden="true" focusable="false">
		{#if category === 'turning'}
			<!-- Turning insert: a rhombus with land, nose radius and callouts. -->
			<path class="ill-line" d="M40 90 L120 50 L200 90 L120 130 Z" />
			<path class="ill-accent" d="M66 90 L120 63 L174 90 L120 117 Z" />
			<circle class="ill-line" cx="120" cy="90" r="13" />
			<path class="ill-dim" d="M120 71 V109 M101 90 H139" stroke-dasharray="8 4 2 4" />
			<path class="ill-dim" d="M40 98 V152 M200 98 V152" />
			<path class="ill-dim" d="M40 148 H200 M37 151 L43 145 M197 151 L203 145" />
			<path class="ill-dim" d="M184 76 A 32 32 0 0 1 184 104" />
		{:else if category === 'milling'}
			<!-- End mill: a fluted cutter seen on-axis with three inserts. -->
			<circle class="ill-line" cx="112" cy="90" r="58" />
			<circle class="ill-line" cx="112" cy="90" r="11" />
			<circle class="ill-dim" cx="112" cy="90" r="36" stroke-dasharray="6 6" />
			<path class="ill-dim" d="M112 68 V112 M90 90 H134" stroke-dasharray="8 4 2 4" />
			<g transform="rotate(18 112 90)">
				<path class="ill-accent" d="M100 22 H124 V44 H100 Z" />
				<circle class="ill-line" cx="112" cy="33" r="4.5" />
			</g>
			<g transform="rotate(138 112 90)">
				<path class="ill-line" d="M100 22 H124 V44 H100 Z" />
				<circle class="ill-line" cx="112" cy="33" r="4.5" />
			</g>
			<g transform="rotate(258 112 90)">
				<path class="ill-line" d="M100 22 H124 V44 H100 Z" />
				<circle class="ill-line" cx="112" cy="33" r="4.5" />
			</g>
			<path class="ill-dim" d="M188 32 V148 M184 32 H192 M184 148 H192" />
		{:else if category === 'drilling'}
			<!-- Drill: a fluted body on its axis with a pointed tip. -->
			<path class="ill-dim" d="M22 90 H218" stroke-dasharray="12 5 3 5" />
			<path class="ill-line" d="M38 76 H96 V104 H38 Z" />
			<path class="ill-line" d="M96 79 H186 M96 101 H186 M186 79 V101" />
			<path class="ill-line" d="M186 79 L199 90 L186 101" />
			<path class="ill-line" d="M104 101 C122 84 132 96 152 79" />
			<path class="ill-line" d="M130 101 C148 84 158 96 178 79" />
			<path class="ill-accent" d="M186 79 L199 90" />
			<path class="ill-dim" d="M177 73 A 28 28 0 0 0 177 107" />
		{:else if category === 'threading'}
			<!-- Threading: a thread profile over a parting/threading tool tip. -->
			<path
				class="ill-accent"
				d="M48 56 L60 36 L72 56 L84 36 L96 56 L108 36 L120 56 L132 36 L144 56 L156 36 L168 56 L180 36 L192 56"
			/>
			<path class="ill-dim" d="M60 24 V32 M84 24 V32 M60 28 H84" />
			<path class="ill-line" d="M70 150 L170 150 L120 78 Z" />
			<circle class="ill-line" cx="120" cy="124" r="10" />
			<path class="ill-dim" d="M103 103 A 30 30 0 0 0 137 103" />
		{:else}
			<!-- Grooving / parting: a slot in stock with a parted land. -->
			<path class="ill-line" d="M34 80 H206 V102 H34 Z" />
			<path class="ill-line" d="M178 88 H206" />
			<path class="ill-accent" d="M186 80 H206 V88 H186 Z" />
			<path class="ill-dim" d="M34 92 H168" stroke-dasharray="10 6" />
			<path class="ill-dim" d="M34 97 H148" stroke-dasharray="10 6" />
			<path class="ill-dim" d="M34 80 H22 M34 102 H22 M26 80 V102 M23 83 L29 77 M23 105 L29 99" />
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
		inline-size: min(82%, 14rem);
		block-size: auto;
	}

	/* Class-based strokes on inline-SVG children are scoped-stripped, so target
	   them through :global() inside the .thumb wrapper. Ink line work and faint
	   dimension lines in the muted role; the single accent stays full ink — the
	   green accent stays reserved for actions, never spent on decoration. */
	.thumb :global(.ill-line),
	.thumb :global(.ill-dim),
	.thumb :global(.ill-accent) {
		fill: none;
		stroke: var(--gok-color-text-muted);
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.thumb :global(.ill-line) {
		stroke-width: 1.5;
	}

	.thumb :global(.ill-dim) {
		stroke-width: 1;
		opacity: 0.4;
	}

	.thumb :global(.ill-accent) {
		stroke-width: 1.5;
		stroke: var(--gok-color-text);
	}
</style>

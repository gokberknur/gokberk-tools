<!--
	The home hero's blueprint centrepiece: a larger engineering reading of a
	turning insert — ink line work, faint dimension lines and construction
	circles, with exactly one ink accent stroke. Same monochrome treatment as
	Thumb, scaled up to anchor the hero. All values are tokens; the green accent
	stays reserved for actions, never spent on decoration.
-->
<div class="hero-art" aria-hidden="true">
	<svg viewBox="0 0 520 380" fill="none" aria-hidden="true" focusable="false">
		<circle class="ill-dim" cx="260" cy="190" r="160" stroke-dasharray="2 10" />
		<path class="ill-line" d="M70 190 L260 95 L450 190 L260 285 Z" />
		<path class="ill-accent" d="M130 190 L260 125 L390 190 L260 255 Z" />
		<circle class="ill-line" cx="260" cy="190" r="30" />
		<path class="ill-dim" d="M260 140 V240 M210 190 H310" stroke-dasharray="10 5 3 5" />
		<path class="ill-dim" d="M70 198 V330 M450 198 V330" />
		<path class="ill-dim" d="M70 322 H450 M66 326 L74 318 M446 326 L454 318" />
		<path class="ill-dim" d="M124 163 A 60 60 0 0 0 124 217" />
		<path class="ill-dim" d="M272 89 L312 62 H352" />
	</svg>
</div>

<style>
	.hero-art {
		position: relative;
		inline-size: 100%;
		block-size: 100%;
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

	.hero-art svg {
		inline-size: min(90%, 32rem);
		block-size: auto;
	}

	/* Class-based strokes on inline-SVG children are scoped-stripped, so target
	   them through :global() inside the .hero-art wrapper. */
	.hero-art :global(.ill-line),
	.hero-art :global(.ill-dim),
	.hero-art :global(.ill-accent) {
		fill: none;
		stroke: var(--gok-color-text-muted);
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.hero-art :global(.ill-line) {
		stroke-width: 1.5;
	}

	.hero-art :global(.ill-dim) {
		stroke-width: 1;
		opacity: 0.4;
	}

	.hero-art :global(.ill-accent) {
		stroke-width: 1.5;
		stroke: var(--gok-color-text);
	}
</style>

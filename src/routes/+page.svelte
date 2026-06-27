<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { CATEGORIES, featuredProducts } from '$lib/data';
	import HeroArt from '$lib/components/HeroArt.svelte';
	import Thumb from '$lib/components/Thumb.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	const featured = featuredProducts();

	// A short, quiet loading beat so the gok-skeleton trio is demonstrated.
	let loaded = $state(false);
	onMount(() => {
		const t = setTimeout(() => (loaded = true), 650);
		return () => clearTimeout(t);
	});
</script>

<svelte:head><title>gökberk tools — precision cutting tools</title></svelte:head>

<!-- Hero -->
<section class="band band--alt band--edge-block-end">
	<div class="band__inner hero">
		<div class="hero__copy">
			<p class="gok-eyebrow">Precision tooling</p>
			<h1 class="gok-headline-1">Tools that hold tolerance, shift after shift.</h1>
			<p class="gok-body-intro lead">
				Carbide inserts, drills, mills, and holders matched to your material and machine.
			</p>
			<div class="hero__actions">
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button variant="primary" onclick={() => goto('/catalog')}>Shop the catalog</gok-button>
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button variant="secondary" onclick={() => goto('/support')}>Talk to an engineer</gok-button>
			</div>
		</div>
		<div class="hero__art">
			<HeroArt />
		</div>
	</div>
</section>

<!-- Categories -->
<section class="band">
	<div class="band__inner">
		<div class="section-head">
			<p class="gok-eyebrow section-head__eyebrow">Catalog</p>
			<h2 class="gok-headline-3 section-head__title">Built for the cut</h2>
			<p class="gok-body-regular section-head__lead">
				From first rough cut to final thread — five families cover the whole machining envelope.
			</p>
		</div>
		<div class="grid grid--wide">
			{#each CATEGORIES as cat (cat.id)}
				<gok-card variant="outlined" interactive>
					<a class="tile" slot="media" href="/catalog?category={cat.id}" aria-label={cat.name}>
						<Thumb category={cat.id} ratio="16 / 9" />
					</a>
					<div slot="header" class="tile__head">
						<p class="gok-eyebrow">{cat.subcategories.length} lines</p>
						<h3 class="gok-headline-5"><a class="title" href="/catalog?category={cat.id}">{cat.name}</a></h3>
					</div>
					<p class="muted gok-body-small">{cat.tagline}</p>
				</gok-card>
			{/each}
		</div>
	</div>
</section>

<!-- Featured -->
<section class="band band--alt">
	<div class="band__inner">
		<div class="section-head">
			<p class="gok-eyebrow section-head__eyebrow">This month</p>
			<h2 class="gok-headline-3 section-head__title">Tools the shop reaches for</h2>
			<p class="gok-body-regular section-head__lead">
				The tools our customers reorder most — on the shelf and ready to ship.
			</p>
		</div>
		<div class="grid">
			{#if loaded}
				{#each featured as product (product.id)}
					<ProductCard {product} />
				{/each}
			{:else}
				{#each featured as _, i (i)}
					<gok-card variant="outlined">
						<div slot="media"><gok-skeleton shape="block" style="aspect-ratio: 4 / 3;"></gok-skeleton></div>
						<div slot="header"><gok-skeleton shape="text" lines="2"></gok-skeleton></div>
						<gok-skeleton shape="text" lines="2"></gok-skeleton>
					</gok-card>
				{/each}
			{/if}
		</div>
	</div>
</section>

<!-- Trust strip -->
<section class="band band--edge">
	<div class="band__inner">
		<dl class="trust">
			<div class="trust__item">
				<dt class="gok-eyebrow">Dispatch</dt>
				<dd class="trust__num gok-tabular-nums">Same day</dd>
			</div>
			<div class="trust__item">
				<dt class="gok-eyebrow">Catalog</dt>
				<dd class="trust__num gok-tabular-nums">8,200 SKUs</dd>
			</div>
			<div class="trust__item">
				<dt class="gok-eyebrow">Repeatability</dt>
				<dd class="trust__num gok-tabular-nums">±0.01 mm</dd>
			</div>
			<div class="trust__item">
				<dt class="gok-eyebrow">Returns</dt>
				<dd class="trust__num gok-tabular-nums">30 days</dd>
			</div>
		</dl>
	</div>
</section>

<style>
	.hero {
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: clamp(var(--gok-space-600), 5vw, var(--gok-space-900));
		align-items: center;
	}

	.hero__copy {
		display: grid;
		gap: var(--gok-space-300);
	}

	.lead {
		color: var(--gok-color-text-muted);
		max-inline-size: 44ch;
	}

	.hero__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gok-space-inline-m);
		margin-block-start: var(--gok-space-400);
	}

	.hero__art {
		border: var(--gok-border-width-hairline) solid var(--gok-color-border);
		border-radius: var(--gok-radius-l);
		overflow: hidden;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: var(--gok-space-500);
	}

	.grid--wide {
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
	}

	.tile,
	.title {
		display: block;
		text-decoration: none;
		color: var(--gok-color-text);
	}

	.title:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.tile__head {
		display: grid;
		gap: var(--gok-space-100);
	}

	.muted {
		color: var(--gok-color-text-muted);
		margin-block-start: var(--gok-space-200);
	}

	.trust {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: var(--gok-space-600) clamp(var(--gok-space-600), 6vw, var(--gok-space-900));
		margin: 0;
	}

	.trust__item {
		display: grid;
		gap: var(--gok-space-200);
	}

	.trust__num {
		margin: 0;
		font-family: var(--gok-font-family-display);
		font-weight: var(--gok-font-weight-light);
		font-size: clamp(2rem, 3vw, 3rem);
		line-height: 1;
		letter-spacing: -0.02em;
	}

	@media (max-width: 56rem) {
		.hero {
			grid-template-columns: 1fr;
		}

		.hero__art {
			order: -1;
		}
	}
</style>

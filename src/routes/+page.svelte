<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { CATEGORIES, featuredProducts } from '$lib/data';
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
<section class="hero gok-container">
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
		<Thumb category="turning" ratio="5 / 4" />
	</div>
</section>

<!-- Categories -->
<section class="gok-container block">
	<header class="head">
		<p class="gok-eyebrow">Catalog</p>
		<h2 class="gok-headline-3">Built for the cut</h2>
	</header>
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
</section>

<!-- Featured -->
<section class="gok-container block">
	<header class="head">
		<p class="gok-eyebrow">This month</p>
		<h2 class="gok-headline-3">Tools the shop reaches for</h2>
	</header>
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
</section>

<!-- Trust strip -->
<section class="gok-container block">
	<dl class="trust">
		<div class="trust__item">
			<dt class="gok-eyebrow">Dispatch</dt>
			<dd class="gok-headline-4 gok-tabular-nums">Same day</dd>
		</div>
		<div class="trust__item">
			<dt class="gok-eyebrow">Catalog</dt>
			<dd class="gok-headline-4 gok-tabular-nums">8,200 SKUs</dd>
		</div>
		<div class="trust__item">
			<dt class="gok-eyebrow">Repeatability</dt>
			<dd class="gok-headline-4 gok-tabular-nums">±0.01 mm</dd>
		</div>
		<div class="trust__item">
			<dt class="gok-eyebrow">Returns</dt>
			<dd class="gok-headline-4 gok-tabular-nums">30 days</dd>
		</div>
	</dl>
</section>

<style>
	.hero {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: var(--gok-space-700);
		align-items: center;
		padding-block: var(--gok-space-section-gap);
	}

	.hero__copy {
		display: grid;
		gap: var(--gok-space-300);
	}

	.lead {
		color: var(--gok-color-text-muted);
		max-inline-size: 48ch;
	}

	.hero__actions {
		display: flex;
		gap: var(--gok-space-inline-m);
		margin-block-start: var(--gok-space-400);
	}

	.hero__art {
		border: var(--gok-border-width-hairline) solid var(--gok-color-border);
		border-radius: var(--gok-radius-l);
		overflow: hidden;
	}

	.block {
		padding-block-end: var(--gok-space-section-gap);
	}

	.head {
		display: grid;
		gap: var(--gok-space-100);
		margin-block-end: var(--gok-space-600);
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
		gap: var(--gok-space-500);
		margin: 0;
		padding-block: var(--gok-space-600);
		border-block: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	.trust__item {
		display: grid;
		gap: var(--gok-space-200);
	}

	.trust__item dd {
		margin: 0;
	}

	@media (max-width: 48rem) {
		.hero {
			grid-template-columns: 1fr;
		}

		.hero__art {
			order: -1;
		}
	}
</style>

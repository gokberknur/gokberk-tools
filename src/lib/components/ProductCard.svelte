<script lang="ts">
	import { toaster } from '@gokberknur/design-system';
	import { goto } from '$app/navigation';
	import { cart } from '$lib/state/cart.svelte';
	import { formatPrice, STOCK_LABEL, STOCK_VARIANT, type Product } from '$lib/data';
	import Thumb from './Thumb.svelte';

	let { product }: { product: Product } = $props();

	const soldOut = $derived(product.stock === 'out');

	function add() {
		cart.add(product.id);
		toaster.success(`Added ${product.name}`, {
			action: { label: 'View cart', onClick: () => goto('/cart') }
		});
	}
</script>

<gok-card variant="outlined" interactive>
	<a class="media" slot="media" href="/product/{product.id}" aria-label={product.name}>
		<Thumb category={product.category} />
	</a>

	<div slot="header" class="head">
		<p class="gok-eyebrow">{product.line}</p>
		<h3 class="gok-headline-5">
			<a class="title" href="/product/{product.id}">{product.name}</a>
		</h3>
	</div>

	<p class="summary gok-body-small">{product.summary}</p>
	<gok-badge size="s" variant={STOCK_VARIANT[product.stock]}>{STOCK_LABEL[product.stock]}</gok-badge>

	<div slot="footer" class="foot">
		<span class="price gok-tabular-nums">
			{formatPrice(product.price)}{#if product.unit}<span class="unit">{product.unit}</span>{/if}
		</span>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<gok-button variant="primary" disabled={soldOut || undefined} onclick={add}>Add</gok-button>
	</div>
</gok-card>

<style>
	.media {
		display: block;
		text-decoration: none;
	}

	.head {
		display: grid;
		gap: var(--gok-space-100);
	}

	.title {
		color: var(--gok-color-text);
		text-decoration: none;
	}

	.title:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.summary {
		color: var(--gok-color-text-muted);
		margin-block: var(--gok-space-200) var(--gok-space-300);
	}

	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--gok-space-300);
	}

	.price {
		font-weight: 600;
	}

	.unit {
		color: var(--gok-color-text-muted);
		font-weight: 400;
		margin-inline-start: var(--gok-space-100);
	}
</style>

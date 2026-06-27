<script lang="ts">
	import { goto } from '$app/navigation';
	import { wishlist } from '$lib/state/wishlist.svelte';
	import { getProduct } from '$lib/data';
	import ProductCard from '$lib/components/ProductCard.svelte';

	const saved = $derived(
		wishlist.ids.map((id) => getProduct(id)).filter((p) => p !== undefined)
	);
</script>

<svelte:head><title>Saved — gökberk tools</title></svelte:head>

<div class="wishlist band__inner">
	<gok-breadcrumb label="Breadcrumb">
		<gok-breadcrumb-item href="/">Home</gok-breadcrumb-item>
		<gok-breadcrumb-item>Saved</gok-breadcrumb-item>
	</gok-breadcrumb>

	<header class="head">
		<p class="gok-eyebrow">Your list</p>
		<h1 class="gok-headline-3">Saved tools</h1>
	</header>

	{#if saved.length === 0}
		<gok-empty-state>
			<p class="gok-headline-4">Nothing saved yet.</p>
			<p class="gok-body-regular muted">Save a tool from its page to keep it here for later.</p>
			<p slot="actions">
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button variant="primary" onclick={() => goto('/catalog')}>Browse tools</gok-button>
			</p>
		</gok-empty-state>
	{:else}
		<div class="grid">
			{#each saved as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.wishlist {
		padding-block: var(--gok-space-600) var(--gok-space-section-gap);
	}

	.head {
		display: grid;
		gap: var(--gok-space-100);
		margin-block: var(--gok-space-400) var(--gok-space-600);
	}

	.muted {
		color: var(--gok-color-text-muted);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: var(--gok-space-500);
	}
</style>

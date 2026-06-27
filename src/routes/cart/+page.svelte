<script lang="ts">
	import { goto } from '$app/navigation';
	import { toaster } from '@gokberknur/design-system';
	import { cart } from '$lib/state/cart.svelte';
	import { getProduct, formatPrice, SHIPPING, TAX_RATE } from '$lib/data';
	import { setProps, on } from '$lib/wc.svelte';
	import Thumb from '$lib/components/Thumb.svelte';

	const lines = $derived(
		cart.items
			.map((item) => ({ item, product: getProduct(item.productId) }))
			.filter((l): l is { item: typeof l.item; product: NonNullable<typeof l.product> } => !!l.product)
	);

	const subtotal = $derived(cart.subtotal);
	const tax = $derived(subtotal * TAX_RATE);
	const total = $derived(subtotal + SHIPPING + tax);

	let removing = $state<string | null>(null);
	let dialogOpen = $state(false);
	let contract = $state('');

	function askRemove(productId: string) {
		removing = productId;
		dialogOpen = true;
	}

	function confirmRemove() {
		if (removing) cart.remove(removing);
		dialogOpen = false;
		removing = null;
	}

	function applyContract() {
		if (contract.trim()) toaster.success('Contract code applied');
	}

	const removingProduct = $derived(removing ? getProduct(removing) : undefined);
</script>

<svelte:head><title>Cart — gökberk tools</title></svelte:head>

<div class="cart band__inner">
	<gok-breadcrumb label="Breadcrumb">
		<gok-breadcrumb-item href="/">Home</gok-breadcrumb-item>
		<gok-breadcrumb-item>Cart</gok-breadcrumb-item>
	</gok-breadcrumb>

	<header class="head">
		<p class="gok-eyebrow">Your order</p>
		<h1 class="gok-headline-3">Cart</h1>
	</header>

	{#if lines.length === 0}
		<gok-empty-state>
			<p class="gok-headline-4">Your cart is empty.</p>
			<p class="gok-body-regular muted">Add a tool to get started.</p>
			<p slot="actions">
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button variant="primary" onclick={() => goto('/catalog')}>Browse tools</gok-button>
			</p>
		</gok-empty-state>
	{:else}
		<div class="layout">
			<ul class="lines">
				{#each lines as { item, product } (product.id)}
					<li class="line">
						<a class="line__media" href="/product/{product.id}" aria-label={product.name}>
							<Thumb category={product.category} ratio="1 / 1" />
						</a>
						<div class="line__body">
							<p class="gok-eyebrow">{product.line}</p>
							<h2 class="gok-headline-5">
								<a class="title" href="/product/{product.id}">{product.name}</a>
							</h2>
							<p class="line__unit gok-body-small gok-tabular-nums">
								{formatPrice(product.price)}{#if product.unit}<span class="muted"> {product.unit}</span>{/if}
							</p>
						</div>
						<div class="line__qty" role="group" aria-label="Quantity">
							<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
							<gok-button
								variant="secondary"
								size="s"
								accessible-label="Decrease quantity"
								onclick={() => cart.setQty(product.id, item.qty - 1)}>−</gok-button>
							<span class="qty gok-tabular-nums">{item.qty}</span>
							<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
							<gok-button
								variant="secondary"
								size="s"
								accessible-label="Increase quantity"
								onclick={() => cart.setQty(product.id, item.qty + 1)}>+</gok-button>
						</div>
						<span class="line__total gok-tabular-nums">{formatPrice(product.price * item.qty)}</span>
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<button class="line__remove" type="button" aria-label="Remove {product.name}" onclick={() => askRemove(product.id)}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
						</button>
					</li>
				{/each}
			</ul>

			<aside class="summary">
				<gok-card variant="outlined">
					<div slot="header"><p class="gok-eyebrow">Summary</p></div>
					<dl class="totals">
						<div><dt>Subtotal</dt><dd class="gok-tabular-nums">{formatPrice(subtotal)}</dd></div>
						<div><dt>Shipping</dt><dd class="gok-tabular-nums">{SHIPPING === 0 ? 'Free' : formatPrice(SHIPPING)}</dd></div>
						<div><dt>Tax</dt><dd class="gok-tabular-nums">{formatPrice(tax)}</dd></div>
						<div class="totals__grand"><dt>Total</dt><dd class="gok-tabular-nums">{formatPrice(total)}</dd></div>
					</dl>

					<form class="contract" onsubmit={(e) => { e.preventDefault(); applyContract(); }}>
						<gok-input
							label="Contract code"
							placeholder="e.g. GK-2026"
							{@attach setProps({ value: contract })}
							{@attach on('input', (e) => (contract = (e.target as HTMLInputElement).value))}></gok-input>
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button variant="secondary" onclick={applyContract}>Apply</gok-button>
					</form>

					<div slot="footer">
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button variant="primary" onclick={() => goto('/checkout')}>Proceed to checkout</gok-button>
					</div>
				</gok-card>
			</aside>
		</div>
	{/if}
</div>

<!-- Confirm remove -->
<gok-dialog
	heading="Remove tool"
	tone="danger"
	{@attach setProps({ open: dialogOpen })}
	{@attach on('gok-close', () => (dialogOpen = false))}
	{@attach on('gok-cancel', () => (dialogOpen = false))}>
	<p>Remove {removingProduct?.name ?? 'this tool'} from your cart?</p>
	<div slot="footer" class="dialog-actions">
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<gok-button variant="secondary" onclick={() => (dialogOpen = false)}>Cancel</gok-button>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<gok-button variant="negative" onclick={confirmRemove}>Remove</gok-button>
	</div>
</gok-dialog>

<style>
	.cart {
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

	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 20rem;
		gap: var(--gok-space-700);
		align-items: start;
	}

	.lines {
		list-style: none;
		margin: 0;
		padding: 0;
		border-block-start: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	.line {
		display: grid;
		grid-template-columns: 4.5rem minmax(0, 1fr) auto auto auto;
		align-items: center;
		gap: var(--gok-space-400);
		padding-block: var(--gok-space-400);
		border-block-end: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	.line__media {
		display: block;
		inline-size: 4.5rem;
		border: var(--gok-border-width-hairline) solid var(--gok-color-border);
		border-radius: var(--gok-radius-m);
		overflow: hidden;
	}

	.line__body {
		display: grid;
		gap: var(--gok-space-100);
		min-inline-size: 0;
	}

	.title {
		color: var(--gok-color-text);
		text-decoration: none;
	}

	.title:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.line__unit {
		color: var(--gok-color-text-muted);
	}

	.line__qty {
		display: inline-flex;
		align-items: center;
		gap: var(--gok-space-200);
	}

	.qty {
		min-inline-size: 2ch;
		text-align: center;
		font-weight: 600;
	}

	.line__total {
		font-weight: 600;
		min-inline-size: 5rem;
		text-align: end;
	}

	.line__remove {
		appearance: none;
		border: 0;
		background: none;
		padding: var(--gok-space-100);
		color: var(--gok-color-text-muted);
		cursor: pointer;
		inline-size: var(--gok-size-icon-m);
		block-size: var(--gok-size-icon-m);
	}

	.line__remove:hover {
		color: var(--gok-color-text);
	}

	.line__remove svg {
		inline-size: 100%;
		block-size: 100%;
	}

	.summary {
		position: sticky;
		inset-block-start: var(--gok-space-600);
	}

	.totals {
		margin: 0;
		display: grid;
		gap: var(--gok-space-300);
	}

	.totals div {
		display: flex;
		justify-content: space-between;
		gap: var(--gok-space-400);
	}

	.totals dt {
		color: var(--gok-color-text-muted);
	}

	.totals dd {
		margin: 0;
	}

	.totals__grand {
		padding-block-start: var(--gok-space-300);
		margin-block-start: var(--gok-space-100);
		border-block-start: var(--gok-border-width-hairline) solid var(--gok-color-border);
		font-weight: 600;
	}

	.totals__grand dt {
		color: var(--gok-color-text);
		font-weight: 600;
	}

	.contract {
		display: grid;
		gap: var(--gok-space-200);
		margin-block-start: var(--gok-space-400);
	}

	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--gok-space-200);
	}

	:global(.summary gok-button) {
		inline-size: 100%;
	}

	@media (max-width: 56rem) {
		.layout {
			grid-template-columns: 1fr;
		}

		.summary {
			position: static;
		}
	}
</style>

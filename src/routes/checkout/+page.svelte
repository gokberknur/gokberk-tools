<script lang="ts">
	import { goto } from '$app/navigation';
	import { cart } from '$lib/state/cart.svelte';
	import { getProduct, formatPrice, SHIPPING, TAX_RATE } from '$lib/data';
	import { setProps, on } from '$lib/wc.svelte';

	type Step = 'shipping' | 'payment' | 'review';
	const STEPS: { id: Step; label: string }[] = [
		{ id: 'shipping', label: 'Shipping' },
		{ id: 'payment', label: 'Payment' },
		{ id: 'review', label: 'Review' }
	];

	let step = $state<Step>('shipping');
	const stepIndex = $derived(STEPS.findIndex((s) => s.id === step));

	const form = $state({
		name: '',
		email: '',
		address: '',
		city: '',
		postal: '',
		country: 'se',
		delivery: 'standard',
		card: '',
		expiry: '',
		cvc: '',
		cardName: '',
		saveCard: false,
		terms: false
	});

	const lines = $derived(
		cart.items
			.map((item) => ({ item, product: getProduct(item.productId) }))
			.filter((l): l is { item: typeof l.item; product: NonNullable<typeof l.product> } => !!l.product)
	);
	const subtotal = $derived(cart.subtotal);
	const total = $derived(subtotal + SHIPPING + subtotal * TAX_RATE);

	const stepValid = $derived.by(() => {
		if (step === 'shipping')
			return !!(form.name && form.email && form.address && form.city && form.postal);
		if (step === 'payment') return !!(form.card && form.expiry && form.cvc && form.cardName);
		return form.terms;
	});

	let placed = $state(false);
	let orderNo = $state('');

	function next() {
		if (!stepValid) return;
		if (step === 'shipping') step = 'payment';
		else if (step === 'payment') step = 'review';
	}
	function back() {
		if (step === 'review') step = 'payment';
		else if (step === 'payment') step = 'shipping';
	}
	function placeOrder() {
		if (!form.terms) return;
		orderNo = `GT-${10000 + Math.floor(Math.random() * 900)}`;
		cart.clear();
		placed = true;
	}
</script>

<svelte:head><title>Checkout — gökberk tools</title></svelte:head>

<div class="checkout band__inner">
	<gok-breadcrumb label="Breadcrumb">
		<gok-breadcrumb-item href="/">Home</gok-breadcrumb-item>
		<gok-breadcrumb-item href="/cart">Cart</gok-breadcrumb-item>
		<gok-breadcrumb-item>Checkout</gok-breadcrumb-item>
	</gok-breadcrumb>

	{#if placed}
		<section class="confirm">
			<gok-icon name="success" size="l" label="Order placed"></gok-icon>
			<h1 class="gok-headline-3">Order {orderNo} placed</h1>
			<p class="gok-body-intro muted">
				Thanks — we've emailed your confirmation. In-stock lines ship today.
			</p>
			<div class="confirm__actions">
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button variant="primary" onclick={() => goto('/account')}>View your orders</gok-button>
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button variant="secondary" onclick={() => goto('/catalog')}>Continue shopping</gok-button>
			</div>
		</section>
	{:else if lines.length === 0}
		<gok-empty-state>
			<p class="gok-headline-4">There's nothing to check out.</p>
			<p slot="actions">
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button variant="primary" onclick={() => goto('/catalog')}>Browse tools</gok-button>
			</p>
		</gok-empty-state>
	{:else}
		<header class="head">
			<p class="gok-eyebrow">Checkout</p>
			<h1 class="gok-headline-3">{STEPS[stepIndex].label}</h1>
		</header>

		<div class="layout">
			<div class="form-col">
				<gok-segmented
					aria-label="Checkout step"
					{@attach setProps({ value: step })}
					{@attach on('change', (e) => (step = (e.target as HTMLInputElement).value as Step))}>
					{#each STEPS as s (s.id)}
						<gok-segmented-item value={s.id}>{s.label}</gok-segmented-item>
					{/each}
				</gok-segmented>

				<div class="step">
					{#if step === 'shipping'}
						<div class="fields">
							<gok-input label="Full name" required {@attach setProps({ value: form.name })} {@attach on('input', (e) => (form.name = (e.target as HTMLInputElement).value))}></gok-input>
							<gok-input label="Email" type="email" required {@attach setProps({ value: form.email })} {@attach on('input', (e) => (form.email = (e.target as HTMLInputElement).value))}></gok-input>
							<gok-input label="Address" required {@attach setProps({ value: form.address })} {@attach on('input', (e) => (form.address = (e.target as HTMLInputElement).value))}></gok-input>
							<div class="row">
								<gok-input label="City" required {@attach setProps({ value: form.city })} {@attach on('input', (e) => (form.city = (e.target as HTMLInputElement).value))}></gok-input>
								<gok-input label="Postal code" required {@attach setProps({ value: form.postal })} {@attach on('input', (e) => (form.postal = (e.target as HTMLInputElement).value))}></gok-input>
							</div>
							<gok-select label="Country" {@attach setProps({ value: form.country })} {@attach on('change', (e) => (form.country = (e.target as HTMLSelectElement).value))}>
								<gok-option value="se">Sweden</gok-option>
								<gok-option value="de">Germany</gok-option>
								<gok-option value="fr">France</gok-option>
								<gok-option value="uk">United Kingdom</gok-option>
							</gok-select>
							<gok-radio-group label="Delivery" {@attach setProps({ value: form.delivery })} {@attach on('change', (e) => (form.delivery = (e.target as HTMLInputElement).value))}>
								<gok-radio value="standard">Standard — 2 business days</gok-radio>
								<gok-radio value="express">Express — next business day</gok-radio>
							</gok-radio-group>
						</div>
					{:else if step === 'payment'}
						<div class="fields">
							<gok-input label="Card number" required inputmode="numeric" placeholder="1234 5678 9012 3456" {@attach setProps({ value: form.card })} {@attach on('input', (e) => (form.card = (e.target as HTMLInputElement).value))}></gok-input>
							<div class="row">
								<gok-input label="Expiry" required placeholder="MM / YY" {@attach setProps({ value: form.expiry })} {@attach on('input', (e) => (form.expiry = (e.target as HTMLInputElement).value))}></gok-input>
								<gok-input label="CVC" required inputmode="numeric" placeholder="123" {@attach setProps({ value: form.cvc })} {@attach on('input', (e) => (form.cvc = (e.target as HTMLInputElement).value))}></gok-input>
							</div>
							<gok-input label="Name on card" required {@attach setProps({ value: form.cardName })} {@attach on('input', (e) => (form.cardName = (e.target as HTMLInputElement).value))}></gok-input>
							<gok-checkbox {@attach setProps({ checked: form.saveCard })} {@attach on('change', (e) => (form.saveCard = (e.target as HTMLInputElement).checked))}>Save card for next time</gok-checkbox>
						</div>
					{:else}
						<div class="review">
							<ul class="review__lines">
								{#each lines as { item, product } (product.id)}
									<li>
										<span>{item.qty} × {product.name}</span>
										<span class="gok-tabular-nums">{formatPrice(product.price * item.qty)}</span>
									</li>
								{/each}
							</ul>
							<gok-checkbox {@attach setProps({ checked: form.terms })} {@attach on('change', (e) => (form.terms = (e.target as HTMLInputElement).checked))}>
								I agree to the terms of sale.
							</gok-checkbox>
						</div>
					{/if}
				</div>

				<div class="nav">
					{#if step !== 'shipping'}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button variant="secondary" onclick={back}>Back</gok-button>
					{/if}
					{#if step === 'review'}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button variant="primary" disabled={!form.terms || undefined} onclick={placeOrder}>Place order</gok-button>
					{:else}
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button variant="primary" disabled={!stepValid || undefined} onclick={next}>Continue</gok-button>
					{/if}
				</div>
			</div>

			<aside class="summary">
				<gok-card variant="outlined">
					<div slot="header"><p class="gok-eyebrow">Summary</p></div>
					<gok-progress label="Checkout" format="fraction" {@attach setProps({ value: stepIndex + 1, max: STEPS.length })}></gok-progress>
					<dl class="totals">
						<div><dt>Subtotal</dt><dd class="gok-tabular-nums">{formatPrice(subtotal)}</dd></div>
						<div><dt>Shipping</dt><dd class="gok-tabular-nums">{SHIPPING === 0 ? 'Free' : formatPrice(SHIPPING)}</dd></div>
						<div class="totals__grand"><dt>Total</dt><dd class="gok-tabular-nums">{formatPrice(total)}</dd></div>
					</dl>
				</gok-card>
			</aside>
		</div>
	{/if}
</div>

<style>
	.checkout {
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
		grid-template-columns: minmax(0, 40rem) minmax(0, 22rem);
		justify-content: start;
		gap: clamp(var(--gok-space-700), 6vw, var(--gok-space-900));
		align-items: start;
	}

	.step {
		margin-block: var(--gok-space-600);
	}

	.fields {
		display: grid;
		gap: var(--gok-space-stack-m);
		max-inline-size: 32rem;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gok-space-400);
	}

	.review__lines {
		list-style: none;
		margin: 0 0 var(--gok-space-500);
		padding: 0;
		display: grid;
		gap: var(--gok-space-300);
		max-inline-size: 32rem;
	}

	.review__lines li {
		display: flex;
		justify-content: space-between;
		gap: var(--gok-space-400);
		padding-block-end: var(--gok-space-300);
		border-block-end: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	.nav {
		display: flex;
		gap: var(--gok-space-300);
		margin-block-start: var(--gok-space-600);
	}

	.summary {
		position: sticky;
		inset-block-start: var(--gok-space-600);
	}

	.totals {
		margin: var(--gok-space-500) 0 0;
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
		border-block-start: var(--gok-border-width-hairline) solid var(--gok-color-border);
		font-weight: 600;
	}

	.totals__grand dt {
		color: var(--gok-color-text);
		font-weight: 600;
	}

	.confirm {
		display: grid;
		justify-items: start;
		gap: var(--gok-space-300);
		padding-block: var(--gok-space-900);
		max-inline-size: 48ch;
	}

	.confirm__actions {
		display: flex;
		gap: var(--gok-space-300);
		margin-block-start: var(--gok-space-400);
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

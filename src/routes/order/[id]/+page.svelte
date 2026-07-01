<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		getOrder,
		ORDER_STEPS,
		ORDER_STATUS_LABEL,
		ORDER_STATUS_VARIANT,
		formatPrice
	} from '$lib/data';
	import { setProps } from '$lib/wc.svelte';

	const order = $derived(getOrder(page.params.id ?? ''));
	const stepIndex = $derived(order ? ORDER_STEPS.findIndex((s) => s.id === order.status) : -1);
	const cancelled = $derived(order?.status === 'cancelled');

	const columns = [
		{ key: 'name', label: 'Item', primary: true },
		{ key: 'qty', label: 'Qty', numeric: true, width: '6rem' },
		{ key: 'price', label: 'Price', numeric: true, width: '8rem' },
		{ key: 'total', label: 'Total', numeric: true, width: '8rem' }
	];
	const rows = $derived(
		order
			? order.lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price, total: l.price * l.qty }))
			: []
	);
	function renderCell(col: { key: string }, row: Record<string, unknown>) {
		if (col.key === 'price') return formatPrice(row.price as number);
		if (col.key === 'total') return formatPrice(row.total as number);
		return String(row[col.key]);
	}
</script>

<svelte:head><title>{order ? `Order ${order.id} — gökberk tools` : 'Order not found'}</title></svelte:head>

<div class="order band__inner">
	<gok-breadcrumb label="Breadcrumb">
		<gok-breadcrumb-item href="/">Home</gok-breadcrumb-item>
		<gok-breadcrumb-item href="/account">Account</gok-breadcrumb-item>
		<gok-breadcrumb-item>{order ? order.id : 'Order'}</gok-breadcrumb-item>
	</gok-breadcrumb>

	{#if !order}
		<gok-empty-state>
			<p class="gok-headline-4">We couldn't find that order.</p>
			<p slot="actions">
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button variant="primary" onclick={() => goto('/account')}>Your orders</gok-button>
			</p>
		</gok-empty-state>
	{:else}
		<gok-page-header eyebrow="Order" heading={order.id} caption={`Placed ${order.date}`}>
			<gok-badge slot="actions" variant={ORDER_STATUS_VARIANT[order.status]}>{ORDER_STATUS_LABEL[order.status]}</gok-badge>
		</gok-page-header>

		{#if cancelled}
			<gok-alert status="error">
				<span slot="title">Order cancelled</span>
				This order was cancelled. Nothing was charged.
			</gok-alert>
		{:else}
			<!-- Step tracker -->
			<div class="tracker">
				<ol class="steps">
					{#each ORDER_STEPS as step, i (step.id)}
						<li class="step" class:is-done={i <= stepIndex} class:is-current={i === stepIndex}>
							<span class="step__dot" aria-hidden="true"></span>
							<span class="step__label gok-eyebrow">{step.label}</span>
						</li>
					{/each}
				</ol>
				<gok-progress
					label="Progress"
					format="fraction"
					{@attach setProps({ value: stepIndex + 1, max: ORDER_STEPS.length })}
				></gok-progress>
			</div>

			{#if order.tracking}
				<gok-alert status="info">
					<span slot="title">Delivery</span>
					{order.tracking}
				</gok-alert>
			{/if}
		{/if}

		<!-- Line items -->
		<section class="lines">
			<h2 class="gok-eyebrow">Items</h2>
			<gok-table accessible-label="Order items" {@attach setProps({ columns, rows, renderCell })}></gok-table>
			<div class="total">
				<span class="gok-eyebrow">Total</span>
				<span class="gok-headline-4 gok-tabular-nums">{formatPrice(order.total)}</span>
			</div>
		</section>
	{/if}
</div>

<style>
	.order {
		padding-block: var(--gok-space-600) var(--gok-space-section-gap);
	}

	gok-page-header {
		margin-block: var(--gok-space-400) var(--gok-space-600);
	}

	.tracker {
		display: grid;
		gap: var(--gok-space-500);
		margin-block-end: var(--gok-space-600);
		max-inline-size: 44rem;
	}

	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--gok-space-300);
	}

	.step {
		display: grid;
		justify-items: center;
		gap: var(--gok-space-200);
		color: var(--gok-color-text-muted);
		text-align: center;
	}

	.step__dot {
		inline-size: var(--gok-space-300);
		block-size: var(--gok-space-300);
		border-radius: var(--gok-radius-pill);
		border: var(--gok-border-width-regular) solid var(--gok-color-border);
		background: var(--gok-color-surface);
	}

	.step.is-done .step__dot {
		background: var(--gok-color-primary);
		border-color: var(--gok-color-primary);
	}

	.step.is-current .step__label {
		color: var(--gok-color-text);
	}

	.lines {
		margin-block-start: var(--gok-space-700);
		display: grid;
		gap: var(--gok-space-400);
		max-inline-size: 44rem;
	}

	.total {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding-block-start: var(--gok-space-300);
		border-block-start: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}
</style>

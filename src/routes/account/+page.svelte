<script lang="ts">
	import { toaster } from '@gokberknur/design-system';
	import { ORDERS, ORDER_STATUS_LABEL, ORDER_STATUS_VARIANT, formatPrice } from '$lib/data';
	import { density } from '$lib/state/density.svelte';
	import { setProps, on } from '$lib/wc.svelte';

	// Table model — gok-table is property-driven (columns/rows/renderCell as DOM props).
	const columns = [
		{ key: 'id', label: 'Order', primary: true, sortable: true, width: '9rem' },
		{ key: 'date', label: 'Date', sortable: true, width: '9rem' },
		{ key: 'status', label: 'Status', width: '11rem' },
		{ key: 'items', label: 'Items', numeric: true, width: '6rem' },
		{ key: 'total', label: 'Total', numeric: true, sortable: true, width: '8rem' }
	];

	const rows = ORDERS.map((o) => ({
		id: o.id,
		date: o.date,
		status: o.status,
		items: o.lines.reduce((n, l) => n + l.qty, 0),
		total: o.total
	}));

	// Custom cell rendering: a gok-badge for status, a link for the order id.
	function renderCell(col: { key: string }, row: Record<string, unknown>) {
		if (col.key === 'status') {
			const status = row.status as keyof typeof ORDER_STATUS_LABEL;
			const b = document.createElement('gok-badge');
			b.setAttribute('size', 's');
			b.setAttribute('variant', ORDER_STATUS_VARIANT[status]);
			b.textContent = ORDER_STATUS_LABEL[status];
			return b;
		}
		if (col.key === 'id') {
			const a = document.createElement('a');
			a.href = `/order/${row.id}`;
			a.textContent = String(row.id);
			a.style.color = 'var(--gok-color-link)';
			a.style.fontWeight = '600';
			return a;
		}
		if (col.key === 'total') return formatPrice(row.total as number);
		return String(row[col.key]);
	}

	// Settings state (local demo).
	let emailUpdates = $state(true);
	let smsUpdates = $state(false);
	let defaultDelivery = $state('standard');

	// Address edit dialog.
	let editOpen = $state(false);

	function saveAddress() {
		editOpen = false;
		toaster.success('Address saved');
	}

	function toggleDensity(checked: boolean) {
		density.set(checked ? 'compact' : 'comfortable');
	}
</script>

<svelte:head><title>Account — gökberk tools</title></svelte:head>

<div class="account band__inner">
	<gok-breadcrumb label="Breadcrumb">
		<gok-breadcrumb-item href="/">Home</gok-breadcrumb-item>
		<gok-breadcrumb-item>Account</gok-breadcrumb-item>
	</gok-breadcrumb>

	<header class="head">
		<p class="gok-eyebrow">Your account</p>
		<h1 class="gok-headline-3">Workshop</h1>
	</header>

	<gok-tabs value="orders">
		<gok-tab slot="tab" value="orders">Orders</gok-tab>
		<gok-tab slot="tab" value="addresses">Addresses</gok-tab>
		<gok-tab slot="tab" value="settings">Settings</gok-tab>

		<!-- Orders -->
		<gok-tab-panel value="orders">
			{#if rows.length === 0}
				<gok-empty-state>
					<p class="gok-headline-5">No orders yet.</p>
					<p class="gok-body-regular muted">When you place an order, it'll show up here.</p>
				</gok-empty-state>
			{:else}
				<gok-table
					accessible-label="Order history"
					{@attach setProps({ columns, rows, renderCell, paginated: true, pageSize: 4 })}
				></gok-table>
			{/if}
		</gok-tab-panel>

		<!-- Addresses -->
		<gok-tab-panel value="addresses">
			<div class="cards">
				<gok-card variant="outlined">
					<div slot="header"><p class="gok-eyebrow">Shipping</p><h2 class="gok-headline-5">Workshop floor</h2></div>
					<address class="addr">
						Verkstadsgatan 12<br />
						116 21 Stockholm<br />
						Sweden
					</address>
					<div slot="footer">
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button variant="secondary" onclick={() => (editOpen = true)}>Edit</gok-button>
					</div>
				</gok-card>
				<gok-card variant="outlined">
					<div slot="header"><p class="gok-eyebrow">Billing</p><h2 class="gok-headline-5">Accounts</h2></div>
					<address class="addr">
						Box 4021<br />
						102 61 Stockholm<br />
						Sweden
					</address>
					<div slot="footer">
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button variant="secondary" onclick={() => (editOpen = true)}>Edit</gok-button>
					</div>
				</gok-card>
			</div>
		</gok-tab-panel>

		<!-- Settings -->
		<gok-tab-panel value="settings">
			<div class="settings">
				<section class="group">
					<h2 class="gok-eyebrow">Notifications</h2>
					<div class="switch-row">
						<div>
							<p class="gok-body-regular">Order updates by email</p>
							<p class="gok-body-small muted">Dispatch, delivery, and back-in-stock notices.</p>
						</div>
						<gok-switch {@attach setProps({ checked: emailUpdates })} {@attach on('change', (e) => (emailUpdates = (e.target as HTMLInputElement).checked))} accessible-label="Order updates by email"></gok-switch>
					</div>
					<div class="switch-row">
						<div>
							<p class="gok-body-regular">Dispatch SMS</p>
							<p class="gok-body-small muted">A text when your order ships.</p>
						</div>
						<gok-switch {@attach setProps({ checked: smsUpdates })} {@attach on('change', (e) => (smsUpdates = (e.target as HTMLInputElement).checked))} accessible-label="Dispatch SMS"></gok-switch>
					</div>
				</section>

				<section class="group">
					<h2 class="gok-eyebrow">Appearance</h2>
					<div class="switch-row">
						<div>
							<p class="gok-body-regular">Theme</p>
							<p class="gok-body-small muted">Light or dark — your choice is remembered.</p>
						</div>
						<gok-theme-switch accessible-label="Theme"></gok-theme-switch>
					</div>
					<div class="switch-row">
						<div>
							<p class="gok-body-regular">Compact density</p>
							<p class="gok-body-small muted">Tighter rows and controls across the store.</p>
						</div>
						<gok-switch {@attach setProps({ checked: density.current === 'compact' })} {@attach on('change', (e) => toggleDensity((e.target as HTMLInputElement).checked))} accessible-label="Compact density"></gok-switch>
					</div>
				</section>

				<section class="group">
					<gok-radio-group
						label="Default delivery"
						{@attach setProps({ value: defaultDelivery })}
						{@attach on('change', (e) => (defaultDelivery = (e.target as HTMLInputElement).value))}>
						<gok-radio value="standard">Standard — 2 business days</gok-radio>
						<gok-radio value="express">Express — next business day</gok-radio>
					</gok-radio-group>
				</section>
			</div>
		</gok-tab-panel>
	</gok-tabs>
</div>

<!-- Edit address dialog -->
<gok-dialog
	heading="Edit address"
	{@attach setProps({ open: editOpen })}
	{@attach on('gok-close', () => (editOpen = false))}
	{@attach on('gok-cancel', () => (editOpen = false))}>
	<div class="dialog-form">
		<gok-input label="Address line"></gok-input>
		<gok-input label="City"></gok-input>
		<gok-input label="Postal code"></gok-input>
	</div>
	<div slot="footer" class="dialog-actions">
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<gok-button variant="secondary" onclick={() => (editOpen = false)}>Cancel</gok-button>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<gok-button variant="primary" onclick={saveAddress}>Save</gok-button>
	</div>
</gok-dialog>

<style>
	.account {
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

	gok-tab-panel {
		padding-block-start: var(--gok-space-600);
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
		gap: var(--gok-space-500);
	}

	.addr {
		font-style: normal;
		color: var(--gok-color-text-muted);
		line-height: var(--gok-type-body-regular-line);
	}

	.settings {
		display: grid;
		gap: var(--gok-space-700);
		max-inline-size: 40rem;
	}

	.group {
		display: grid;
		gap: var(--gok-space-400);
	}

	.switch-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--gok-space-500);
		padding-block: var(--gok-space-300);
		border-block-end: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	.switch-row p {
		margin: 0;
	}

	.dialog-form {
		display: grid;
		gap: var(--gok-space-stack-m);
		min-inline-size: min(24rem, 70vw);
	}

	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--gok-space-200);
	}
</style>

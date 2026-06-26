<script lang="ts">
	import '../app.css';
	import '@gokberknur/design-system/standalone.css';
	import '$lib/gok';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { cart } from '$lib/state/cart.svelte';
	import { wishlist } from '$lib/state/wishlist.svelte';
	import { density } from '$lib/state/density.svelte';
	import { getProduct, formatPrice } from '$lib/data';
	import { setProps, on } from '$lib/wc.svelte';

	let { children } = $props();

	let q = $state('');
	let cartOpen = $state(false);

	const section = $derived.by(() => {
		const path = page.url.pathname;
		if (path.startsWith('/catalog') || path.startsWith('/product')) return 'catalog';
		if (path.startsWith('/journal')) return 'journal';
		if (path.startsWith('/support')) return 'support';
		return '';
	});

	function handleSearch(e: SubmitEvent) {
		e.preventDefault();
		const term = q.trim();
		goto(term ? `/catalog?q=${encodeURIComponent(term)}` : '/catalog');
	}

	function handleMenu(e: Event) {
		const v = (e as CustomEvent).detail?.value;
		if (v === 'density') {
			density.toggle();
			return;
		}
		if (v === 'account') goto('/account');
		else if (v === 'orders') goto('/account');
		else if (v === 'wishlist') goto('/wishlist');
		else if (v === 'signout') goto('/');
	}

	function openCart() {
		cartOpen = true;
	}

	function go(path: string) {
		cartOpen = false;
		goto(path);
	}

	function handleNewsletter(e: SubmitEvent) {
		e.preventDefault();
	}
</script>

<div class="app">
	<gok-navbar class="chrome" accessible-label="Primary" {@attach setProps({ value: section })}>
		<a slot="brand" class="brand" href="/">gökberk<span class="brand__dot">.</span> tools</a>
		<gok-navbar-item href="/catalog" value="catalog">Catalog</gok-navbar-item>
		<gok-navbar-item href="/journal" value="journal">Journal</gok-navbar-item>
		<gok-navbar-item href="/support" value="support">Support</gok-navbar-item>
		<div slot="actions" class="actions">
			<form class="search" onsubmit={handleSearch} role="search">
				<gok-input
					type="search"
					placeholder="Search tools"
					accessible-label="Search tools"
					{@attach on('input', (e) => (q = (e.target as HTMLInputElement & { value: string }).value))}
				>
					<svg
						slot="leading"
						class="ico"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
					>
						<circle cx="11" cy="11" r="6" />
						<path d="m20 20-3.2-3.2" />
					</svg>
				</gok-input>
			</form>
			<gok-theme-switch accessible-label="Theme"></gok-theme-switch>
			<gok-menu placement="bottom-end" {@attach on('gok-select', handleMenu)}>
				<gok-button slot="trigger" variant="secondary" accessible-label="Account menu">
					<svg
						slot="icon"
						class="ico"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
					>
						<circle cx="12" cy="8" r="3.5" />
						<path d="M5 20a7 7 0 0 1 14 0" />
					</svg>
				</gok-button>
				<gok-menu-item value="account">Account</gok-menu-item>
				<gok-menu-item value="orders">Orders</gok-menu-item>
				<gok-menu-item value="wishlist">Wishlist · {wishlist.count}</gok-menu-item>
				<hr />
				<gok-menu-item
					type="checkbox"
					value="density"
					{@attach setProps({ checked: density.current === 'compact' })}
				>
					Compact density
				</gok-menu-item>
				<hr />
				<gok-menu-item value="signout">Sign out</gok-menu-item>
			</gok-menu>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<gok-button class="cart-btn" variant="secondary" accessible-label="Cart" onclick={openCart}>
				<svg
					slot="icon"
					class="ico"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					aria-hidden="true"
				>
					<path d="M3 4h2l2.2 11a1 1 0 0 0 1 .8h8a1 1 0 0 0 1-.8L20 8H6" />
					<circle cx="9" cy="20" r="1.2" />
					<circle cx="18" cy="20" r="1.2" />
				</svg>
				{#if cart.count > 0}<gok-badge size="s" variant="success">{cart.count}</gok-badge>{/if}
			</gok-button>
		</div>
	</gok-navbar>

	<main class="app__main">{@render children()}</main>

	<footer class="footer">
		<div class="gok-container">
			<div class="footer__grid">
				<div class="footer__col">
					<h2 class="gok-eyebrow footer__heading">Shop</h2>
					<gok-link href="/catalog">Catalog</gok-link>
					<gok-link href="/catalog">New tools</gok-link>
					<gok-link href="/catalog">Contract pricing</gok-link>
				</div>
				<div class="footer__col">
					<h2 class="gok-eyebrow footer__heading">Company</h2>
					<gok-link href="/journal">Journal</gok-link>
					<gok-link href="/support">Support</gok-link>
					<gok-link href="/">About</gok-link>
				</div>
				<div class="footer__col">
					<h2 class="gok-eyebrow footer__heading">Account</h2>
					<gok-link href="/account">Orders</gok-link>
					<gok-link href="/wishlist">Wishlist</gok-link>
					<gok-link href="/account">Sign in</gok-link>
				</div>
				<div class="footer__col footer__news">
					<h2 class="gok-eyebrow footer__heading">Get field notes</h2>
					<p class="footer__note">
						Tolerances, materials, and the occasional teardown — a few times a year.
					</p>
					<form class="footer__form" onsubmit={handleNewsletter}>
						<gok-input
							type="email"
							placeholder="you@workshop.com"
							accessible-label="Email address"
						></gok-input>
						<gok-button variant="primary" type="submit">Subscribe</gok-button>
					</form>
				</div>
			</div>
			<div class="footer__legal">
				<span>© 2026 gökberk tools</span>
				<span>Tools that hold tolerance.</span>
			</div>
		</div>
	</footer>

	<gok-drawer
		placement="end"
		heading="Cart"
		{@attach setProps({ open: cartOpen })}
		{@attach on('gok-close', () => (cartOpen = false))}
		{@attach on('gok-cancel', () => (cartOpen = false))}
	>
		{#if cart.items.length === 0}
			<gok-empty-state variant="compact">
				<p>Your cart is empty.</p>
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button slot="actions" variant="secondary" onclick={() => go('/catalog')}>
					Browse tools
				</gok-button>
			</gok-empty-state>
		{:else}
			<ul class="mini-cart">
				{#each cart.items as item (item.productId)}
					{@const p = getProduct(item.productId)}
					{#if p}
						<li class="mini-cart__row">
							<div>
								<p class="mini-cart__name">{p.name}</p>
								<p class="mini-cart__meta">{item.qty} × {formatPrice(p.price)}</p>
							</div>
							<span class="mini-cart__total gok-tabular-nums">{formatPrice(p.price * item.qty)}</span>
						</li>
					{/if}
				{/each}
			</ul>
			<div class="mini-cart__sum">
				<span>Subtotal</span><span class="gok-tabular-nums">{formatPrice(cart.subtotal)}</span>
			</div>
		{/if}
		<div slot="footer" class="mini-cart__actions">
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<gok-button variant="secondary" onclick={() => go('/cart')}>View cart</gok-button>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<gok-button variant="primary" onclick={() => go('/checkout')}>Checkout</gok-button>
		</div>
	</gok-drawer>

	<gok-toast-region placement="bottom-end"></gok-toast-region>
</div>

<style>
	.brand {
		text-decoration: none;
		color: var(--gok-color-text);
		font-family: var(--gok-type-headline-5-family);
		font-weight: var(--gok-type-headline-5-weight);
		font-size: var(--gok-type-headline-5-size);
		letter-spacing: var(--gok-type-headline-5-tracking);
	}

	.brand__dot {
		color: var(--gok-color-primary);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: var(--gok-space-200);
	}

	.search gok-input {
		inline-size: clamp(8rem, 18vw, 14rem);
	}

	.ico {
		inline-size: var(--gok-size-icon-m);
		block-size: var(--gok-size-icon-m);
		display: block;
	}

	.cart-btn {
		position: relative;
	}

	/* Mini-cart drawer */
	.mini-cart {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.mini-cart__row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--gok-space-300);
		padding-block: var(--gok-space-300);
		border-block-end: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	.mini-cart__name {
		margin: 0;
		color: var(--gok-color-text);
	}

	.mini-cart__meta {
		margin: 0;
		color: var(--gok-color-text-muted);
		font-size: var(--gok-type-body-small-size);
		line-height: var(--gok-type-body-small-line);
	}

	.mini-cart__total {
		color: var(--gok-color-text);
	}

	.mini-cart__sum {
		display: flex;
		justify-content: space-between;
		font-weight: 600;
		padding-block-start: var(--gok-space-400);
	}

	.mini-cart__actions {
		display: flex;
		gap: var(--gok-space-200);
		justify-content: flex-end;
	}

	.mini-cart__actions gok-button {
		flex: 1;
	}

	/* Footer */
	.footer {
		border-block-start: var(--gok-border-width-hairline) solid var(--gok-color-border);
		padding-block: var(--gok-space-section);
	}

	.footer__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: var(--gok-space-700);
	}

	.footer__col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--gok-space-300);
	}

	.footer__heading {
		margin: 0;
		color: var(--gok-color-text-muted);
	}

	.footer__note {
		margin: 0;
		color: var(--gok-color-text-muted);
		font-size: var(--gok-type-body-small-size);
		line-height: var(--gok-type-body-small-line);
	}

	.footer__news {
		gap: var(--gok-space-400);
	}

	.footer__form {
		display: flex;
		align-items: center;
		align-self: stretch;
		gap: var(--gok-space-200);
	}

	.footer__form gok-input {
		flex: 1;
		min-inline-size: 0;
	}

	.footer__legal {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--gok-space-300);
		margin-block-start: var(--gok-space-600);
		padding-block-start: var(--gok-space-400);
		border-block-start: var(--gok-border-width-hairline) solid var(--gok-color-border);
		color: var(--gok-color-text-muted);
		font-size: var(--gok-type-body-small-size);
	}
</style>

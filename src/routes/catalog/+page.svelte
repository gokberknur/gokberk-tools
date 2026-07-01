<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PRODUCTS, CATEGORIES, MATERIALS, type CategoryId } from '$lib/data';
	import { on, setProps } from '$lib/wc.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	const PAGE_SIZE = 6;

	// URL-driven filters (category + search), reactive via $app/state.
	const categoryParam = $derived((page.url.searchParams.get('category') as CategoryId | null) ?? null);
	const q = $derived(page.url.searchParams.get('q') ?? '');
	const activeCategory = $derived(CATEGORIES.find((c) => c.id === categoryParam) ?? null);

	// Local filters.
	let materials = $state<string[]>([]);
	let sort = $state<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
	let inStockOnly = $state(false);
	let view = $state<'grid' | 'list'>('grid');
	let current = $state(1);
	let drawerOpen = $state(false);
	let loading = $state(true);

	onMount(() => {
		const t = setTimeout(() => (loading = false), 550);
		return () => clearTimeout(t);
	});

	const filtered = $derived.by(() => {
		let list = PRODUCTS.slice();
		if (categoryParam) list = list.filter((p) => p.category === categoryParam);
		if (q) {
			const t = q.toLowerCase();
			list = list.filter((p) =>
				`${p.name} ${p.summary} ${p.materials.join(' ')}`.toLowerCase().includes(t)
			);
		}
		if (materials.length) list = list.filter((p) => p.materials.some((m) => materials.includes(m)));
		if (inStockOnly) list = list.filter((p) => p.stock !== 'out');
		switch (sort) {
			case 'price-asc':
				list.sort((a, b) => a.price - b.price);
				break;
			case 'price-desc':
				list.sort((a, b) => b.price - a.price);
				break;
			case 'name':
				list.sort((a, b) => a.name.localeCompare(b.name));
				break;
			default:
				list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
		}
		return list;
	});

	const pageCount = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const paged = $derived(filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE));

	// Reset to page 1 whenever a filter input changes (doesn't read `current`, so no loop).
	$effect(() => {
		// touch the filter inputs to track them
		materials.length;
		void sort;
		void inStockOnly;
		void categoryParam;
		void q;
		current = 1;
	});
	// Keep the page in range if the result set shrinks.
	$effect(() => {
		if (current > pageCount) current = pageCount;
	});

	function clearFilters() {
		materials = [];
		inStockOnly = false;
		sort = 'featured';
		if (categoryParam || q) goto('/catalog');
	}

	const heading = $derived(activeCategory ? activeCategory.name : q ? `“${q}”` : 'All tools');
</script>

<svelte:head><title>Catalog — gökberk tools</title></svelte:head>

<div class="catalog band__inner">
	<gok-breadcrumb label="Breadcrumb">
		<gok-breadcrumb-item href="/">Home</gok-breadcrumb-item>
		<gok-breadcrumb-item href="/catalog">Catalog</gok-breadcrumb-item>
		{#if activeCategory}<gok-breadcrumb-item>{activeCategory.name}</gok-breadcrumb-item>{/if}
	</gok-breadcrumb>

	<div class="shell">
		<!-- Category rail (desktop) -->
		<aside class="rail">
			<gok-sidenav aria-label="Categories" {@attach setProps({ value: categoryParam ?? 'all' })}>
				<gok-sidenav-section heading="Browse">
					<gok-sidenav-item href="/catalog" value="all">All tools</gok-sidenav-item>
					{#each CATEGORIES as cat (cat.id)}
						<gok-sidenav-item href="/catalog?category={cat.id}" value={cat.id}>{cat.name}</gok-sidenav-item>
					{/each}
				</gok-sidenav-section>
			</gok-sidenav>
		</aside>

		<main class="main">
			<gok-page-header eyebrow="Catalog" heading={heading}>
				<p slot="actions" class="count gok-body-small gok-tabular-nums">
					{filtered.length}
					{filtered.length === 1 ? 'tool' : 'tools'}
				</p>
			</gok-page-header>

			<!-- Filter bar -->
			<div class="filters">
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button class="filters__mobile" variant="secondary" onclick={() => (drawerOpen = true)}>
					Categories
				</gok-button>

				<gok-multi-select
					class="facets"
					label="Material"
					placeholder="Any material"
					{@attach setProps({ options: MATERIALS.map((m) => ({ value: m, label: m })), values: materials })}
					{@attach on('change', (e) => (materials = [...(e.target as HTMLElement & { values: string[] }).values]))}
				></gok-multi-select>

				<div class="controls">
					<span class="stock">
						<gok-switch
							{@attach setProps({ checked: inStockOnly })}
							{@attach on('change', (e) => (inStockOnly = (e.target as HTMLInputElement).checked))}
							accessible-label="In stock only"></gok-switch>
						<span class="gok-body-small">In stock</span>
					</span>

					<gok-select
						accessible-label="Sort"
						{@attach setProps({ value: sort })}
						{@attach on('change', (e) => (sort = (e.target as HTMLSelectElement).value as typeof sort))}>
						<gok-option value="featured">Featured</gok-option>
						<gok-option value="price-asc">Price, low to high</gok-option>
						<gok-option value="price-desc">Price, high to low</gok-option>
						<gok-option value="name">Name</gok-option>
					</gok-select>

					<gok-segmented
						aria-label="View"
						{@attach setProps({ value: view })}
						{@attach on('change', (e) => (view = (e.target as HTMLInputElement).value as typeof view))}>
						<gok-segmented-item value="grid">Grid</gok-segmented-item>
						<gok-segmented-item value="list">List</gok-segmented-item>
					</gok-segmented>
				</div>
			</div>

			<!-- Results -->
			{#if loading}
				<div class="grid">
					{#each Array(PAGE_SIZE) as _, i (i)}
						<gok-card variant="outlined">
							<div slot="media"><gok-skeleton shape="block" style="aspect-ratio: 4 / 3;"></gok-skeleton></div>
							<div slot="header"><gok-skeleton shape="text" lines="2"></gok-skeleton></div>
							<gok-skeleton shape="text" lines="2"></gok-skeleton>
						</gok-card>
					{/each}
				</div>
			{:else if filtered.length === 0}
				<gok-empty-state>
					<p class="gok-headline-5">No tools match these filters.</p>
					<p slot="actions" class="empty-actions">
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button variant="secondary" onclick={clearFilters}>Clear filters</gok-button>
					</p>
				</gok-empty-state>
			{:else}
				<div class="grid" class:grid--list={view === 'list'}>
					{#each paged as product (product.id)}
						<ProductCard {product} />
					{/each}
				</div>

				{#if pageCount > 1}
					<div class="pager">
						<gok-pagination
							{@attach setProps({ total: pageCount, page: current })}
							{@attach on('gok-page-change', (e) => (current = (e as CustomEvent).detail.page))}
						></gok-pagination>
					</div>
				{/if}
			{/if}
		</main>
	</div>
</div>

<!-- Mobile category drawer -->
<gok-drawer
	placement="start"
	heading="Categories"
	{@attach setProps({ open: drawerOpen })}
	{@attach on('gok-close', () => (drawerOpen = false))}
	{@attach on('gok-cancel', () => (drawerOpen = false))}>
	<nav class="drawer-nav">
		<a href="/catalog" class="drawer-link" class:is-active={!categoryParam}>All tools</a>
		{#each CATEGORIES as cat (cat.id)}
			<a
				href="/catalog?category={cat.id}"
				class="drawer-link"
				class:is-active={categoryParam === cat.id}>{cat.name}</a>
		{/each}
	</nav>
</gok-drawer>

<style>
	.catalog {
		padding-block: var(--gok-space-600) var(--gok-space-section-gap);
	}

	.shell {
		display: grid;
		grid-template-columns: 15rem minmax(0, 1fr);
		gap: var(--gok-space-700);
		margin-block-start: var(--gok-space-500);
		align-items: start;
	}

	.rail {
		position: sticky;
		inset-block-start: var(--gok-space-600);
	}

	gok-page-header {
		margin-block-end: var(--gok-space-500);
	}

	.count {
		color: var(--gok-color-text-muted);
		white-space: nowrap;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gok-space-400);
		padding-block-end: var(--gok-space-500);
		margin-block-end: var(--gok-space-500);
		border-block-end: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	.filters__mobile {
		display: none;
	}

	.facets {
		min-inline-size: 12rem;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: var(--gok-space-400);
		margin-inline-start: auto;
	}

	.stock {
		display: inline-flex;
		align-items: center;
		gap: var(--gok-space-200);
		cursor: pointer;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: var(--gok-space-500);
	}

	.grid--list {
		grid-template-columns: 1fr;
		max-inline-size: 44rem;
	}

	.pager {
		display: flex;
		justify-content: center;
		margin-block-start: var(--gok-space-700);
	}

	.empty-actions {
		margin: 0;
	}

	.drawer-nav {
		display: grid;
		gap: var(--gok-space-100);
	}

	.drawer-link {
		display: block;
		padding-block: var(--gok-space-300);
		padding-inline: var(--gok-space-300);
		border-radius: var(--gok-radius-m);
		color: var(--gok-color-text);
		text-decoration: none;
	}

	.drawer-link:hover {
		background: var(--gok-color-surface-hover);
	}

	.drawer-link.is-active {
		color: var(--gok-color-primary);
		font-weight: 600;
	}

	@media (max-width: 64rem) {
		.shell {
			grid-template-columns: 1fr;
		}

		.rail {
			display: none;
		}

		.filters__mobile {
			display: inline-flex;
		}

		.controls {
			margin-inline-start: 0;
		}
	}
</style>

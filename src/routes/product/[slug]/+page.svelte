<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { toaster } from '@gokberknur/design-system';
	import {
		getProduct,
		formatPrice,
		STOCK_LABEL,
		STOCK_VARIANT,
		MATERIALS,
		CATEGORIES
	} from '$lib/data';
	import { cart } from '$lib/state/cart.svelte';
	import { wishlist } from '$lib/state/wishlist.svelte';
	import Thumb from '$lib/components/Thumb.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';

	const product = $derived(getProduct(page.params.slug ?? ''));
	const category = $derived(product ? CATEGORIES.find((c) => c.id === product.category) : undefined);
	const related = $derived(
		product ? product.related.map((id) => getProduct(id)).filter((p) => p !== undefined) : []
	);
	const saved = $derived(product ? wishlist.has(product.id) : false);

	let qty = $state(1);

	function add() {
		if (!product) return;
		cart.add(product.id, qty);
		toaster.success(`Added ${qty} × ${product.name}`, {
			action: { label: 'View cart', onClick: () => goto('/cart') }
		});
	}

	function toggleSave() {
		if (!product) return;
		wishlist.toggle(product.id);
		toaster.neutral(saved ? 'Removed from saved' : `Saved ${product.name}`);
	}
</script>

<svelte:head><title>{product ? `${product.name} — gökberk tools` : 'Tool not found'}</title></svelte:head>

{#if !product}
	<section class="band__inner missing">
		<gok-empty-state>
			<p class="gok-headline-4">We couldn't find that tool.</p>
			<p slot="actions">
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button variant="primary" onclick={() => goto('/catalog')}>Back to catalog</gok-button>
			</p>
		</gok-empty-state>
	</section>
{:else}
	<div class="pdp band__inner">
		<gok-breadcrumb label="Breadcrumb">
			<gok-breadcrumb-item href="/">Home</gok-breadcrumb-item>
			<gok-breadcrumb-item href="/catalog">Catalog</gok-breadcrumb-item>
			{#if category}
				<gok-breadcrumb-item href="/catalog?category={category.id}">{category.name}</gok-breadcrumb-item>
			{/if}
			<gok-breadcrumb-item>{product.name}</gok-breadcrumb-item>
		</gok-breadcrumb>

		<!-- Hero -->
		<div class="hero">
			<div class="media">
				<Thumb category={product.category} ratio="1 / 1" />
			</div>

			<div class="info">
				<p class="gok-eyebrow">{product.line}</p>
				<h1 class="gok-headline-2">{product.name}</h1>
				<p class="pdp__code">{product.articleCode}</p>

				<div class="price-row">
					<span class="price gok-headline-4 gok-tabular-nums">
						{formatPrice(product.price)}{#if product.unit}<span class="unit">{product.unit}</span>{/if}
					</span>
					<gok-badge variant={STOCK_VARIANT[product.stock]}>{STOCK_LABEL[product.stock]}</gok-badge>
				</div>

				<p class="desc gok-body-regular">{product.description}</p>

				<div class="tags">
					{#each product.materials as m (m)}
						<gok-tag variant="readonly">{m}</gok-tag>
					{/each}
					<gok-popover placement="bottom">
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button variant="secondary" size="s">Material guide</gok-button>
						<span slot="heading">Material guide</span>
						<div slot="content" class="guide">
							{#each MATERIALS as m (m)}
								<p class="guide__row"><span class="guide__name">{m}</span></p>
							{/each}
							<p class="guide__note gok-body-small">
								Each tool lists the material families it's matched to. Between grades? Talk to an engineer.
							</p>
						</div>
					</gok-popover>
				</div>

				<!-- Buy row -->
				<div class="buy">
					<div class="stepper" role="group" aria-label="Quantity">
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button
							variant="secondary"
							accessible-label="Decrease quantity"
							disabled={qty <= 1 || undefined}
							onclick={() => (qty = Math.max(1, qty - 1))}>−</gok-button>
						<span class="qty gok-tabular-nums" aria-live="polite">{qty}</span>
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button
							variant="secondary"
							accessible-label="Increase quantity"
							onclick={() => (qty += 1)}>+</gok-button>
					</div>
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<gok-button
						variant="primary"
						disabled={product.stock === 'out' || undefined}
						onclick={add}>Add to cart</gok-button>
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<gok-button variant="secondary" onclick={toggleSave}>{saved ? 'Saved' : 'Save'}</gok-button>
				</div>

				<gok-alert status="info">
					<span slot="title">Contract pricing</span>
					Enter your contract code at checkout to see your agreed rate.
				</gok-alert>
			</div>
		</div>

		<gok-divider></gok-divider>

		<!-- Detail tabs -->
		<gok-tabs value="overview" class="panels">
			<gok-tab slot="tab" value="overview">Overview</gok-tab>
			<gok-tab slot="tab" value="specs">Specifications</gok-tab>
			<gok-tab slot="tab" value="compat">Compatibility</gok-tab>

			<gok-tab-panel value="overview">
				<p class="gok-body-regular measure">{product.description}</p>
			</gok-tab-panel>

			<gok-tab-panel value="specs">
				<div class="specs">
					{#each product.specs as group (group.heading)}
						<section class="specs__group">
							<h3 class="gok-eyebrow specs__heading">{group.heading}</h3>
							<dl class="specs__list">
								{#each group.rows as spec (spec.label)}
									<div class="specs__row">
										<dt>
											{spec.label}
											{#if spec.label === 'Grade'}
												<gok-tooltip placement="top">
													<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
													<button class="info-btn" type="button" aria-label="What is a grade?">
														<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
													</button>
													<span slot="content">A grade pairs a carbide substrate with a coating, tuned to a material and operation.</span>
												</gok-tooltip>
											{/if}
										</dt>
										<dd class="gok-tabular-nums">{spec.value}</dd>
									</div>
								{/each}
							</dl>
						</section>
					{/each}
				</div>
			</gok-tab-panel>

			<gok-tab-panel value="compat">
				<ul class="compat">
					{#each product.compatibility as c (c)}
						<li>{c}</li>
					{/each}
				</ul>
			</gok-tab-panel>
		</gok-tabs>

		<!-- Secondary detail -->
		<gok-accordion class="extra">
			<gok-accordion-item>
				<span slot="summary">Shipping &amp; returns</span>
				<p class="gok-body-regular measure">
					In-stock tools ship the same day on orders before 3 pm. Unused tools can be returned within
					30 days; made-to-order items are non-returnable.
				</p>
			</gok-accordion-item>
			<gok-accordion-item>
				<span slot="summary">Warranty</span>
				<p class="gok-body-regular measure">
					If an edge fails inside its expected life, send us the tool and your cutting data — we
					replace it and look at what happened.
				</p>
			</gok-accordion-item>
		</gok-accordion>

		<!-- Related -->
		{#if related.length}
			<section class="related">
				<header class="head">
					<p class="gok-eyebrow">Pairs well with</p>
					<h2 class="gok-headline-4">Complete the setup</h2>
				</header>
				<div class="grid">
					{#each related as r (r.id)}
						<ProductCard product={r} />
					{/each}
				</div>
			</section>
		{/if}
	</div>
{/if}

<style>
	.pdp {
		padding-block: var(--gok-space-600) var(--gok-space-section-gap);
	}

	.missing {
		padding-block: var(--gok-space-section-gap);
	}

	.hero {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gok-space-700);
		align-items: start;
		margin-block: var(--gok-space-500) var(--gok-space-700);
	}

	.media {
		border: var(--gok-border-width-hairline) solid var(--gok-color-border);
		border-radius: var(--gok-radius-l);
		overflow: hidden;
		position: sticky;
		inset-block-start: var(--gok-space-600);
	}

	.info {
		display: grid;
		gap: var(--gok-space-300);
	}

	.info h1 {
		margin-block: var(--gok-space-100) 0;
	}

	.pdp__code {
		margin: 0;
		font-family: var(--gok-font-family-mono);
		font-size: var(--gok-type-body-small-size);
		line-height: var(--gok-type-body-small-line);
		color: var(--gok-color-text-muted);
	}

	.price-row {
		display: flex;
		align-items: center;
		gap: var(--gok-space-400);
	}

	.unit {
		color: var(--gok-color-text-muted);
		font-size: var(--gok-type-body-small-size);
		font-weight: 400;
		margin-inline-start: var(--gok-space-100);
	}

	.desc {
		color: var(--gok-color-text-muted);
		max-inline-size: 56ch;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gok-space-200);
	}

	.buy {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--gok-space-300);
		margin-block: var(--gok-space-300);
	}

	.stepper {
		display: inline-flex;
		align-items: center;
		gap: var(--gok-space-200);
	}

	.qty {
		min-inline-size: 2ch;
		text-align: center;
		font-weight: 600;
	}

	.guide {
		display: grid;
		gap: var(--gok-space-100);
		max-inline-size: 18rem;
	}

	.guide__row {
		margin: 0;
	}

	.guide__name {
		font-weight: 600;
	}

	.guide__note {
		color: var(--gok-color-text-muted);
		margin-block-start: var(--gok-space-200);
	}

	.panels {
		margin-block: var(--gok-space-600);
	}

	.measure {
		max-inline-size: 68ch;
		color: var(--gok-color-text-muted);
	}

	.specs {
		display: grid;
		gap: var(--gok-space-600);
		max-inline-size: 40rem;
	}

	.specs__group {
		display: grid;
		gap: var(--gok-space-200);
	}

	.specs__heading {
		margin: 0 0 var(--gok-space-100);
		color: var(--gok-color-text-muted);
	}

	.specs__list {
		margin: 0;
	}

	.specs__row {
		display: flex;
		justify-content: space-between;
		gap: var(--gok-space-400);
		padding-block: var(--gok-space-300);
		border-block-end: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	.specs__row dt {
		display: inline-flex;
		align-items: center;
		gap: var(--gok-space-100);
		color: var(--gok-color-text-muted);
	}

	.specs__row dd {
		margin: 0;
		font-weight: 600;
	}

	.compat {
		margin: 0;
		padding-inline-start: var(--gok-space-500);
		display: grid;
		gap: var(--gok-space-200);
		color: var(--gok-color-text-muted);
	}

	.info-btn {
		appearance: none;
		display: inline-grid;
		place-items: center;
		inline-size: var(--gok-size-icon-s);
		block-size: var(--gok-size-icon-s);
		padding: 0;
		border: 0;
		background: none;
		color: var(--gok-color-text-muted);
		cursor: pointer;
	}

	.info-btn svg {
		inline-size: 100%;
		block-size: 100%;
	}

	.extra {
		margin-block: var(--gok-space-600);
		max-inline-size: 48rem;
	}

	.related {
		margin-block-start: var(--gok-space-800);
	}

	.head {
		display: grid;
		gap: var(--gok-space-100);
		margin-block-end: var(--gok-space-500);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: var(--gok-space-500);
	}

	@media (max-width: 56rem) {
		.hero {
			grid-template-columns: 1fr;
		}

		.media {
			position: static;
		}
	}
</style>

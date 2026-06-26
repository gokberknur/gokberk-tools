<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getPost } from '$lib/data';

	const post = $derived(getPost(page.params.slug ?? ''));
</script>

<svelte:head><title>{post ? `${post.title} — gökberk tools` : 'Post not found'}</title></svelte:head>

<div class="post-page gok-container">
	<gok-breadcrumb label="Breadcrumb">
		<gok-breadcrumb-item href="/">Home</gok-breadcrumb-item>
		<gok-breadcrumb-item href="/journal">Journal</gok-breadcrumb-item>
		<gok-breadcrumb-item>{post ? post.title : 'Post'}</gok-breadcrumb-item>
	</gok-breadcrumb>

	{#if !post}
		<gok-empty-state>
			<p class="gok-headline-4">We couldn't find that post.</p>
			<p slot="actions">
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
				<gok-button variant="primary" onclick={() => goto('/journal')}>Back to journal</gok-button>
			</p>
		</gok-empty-state>
	{:else}
		<header class="head">
			<p class="gok-eyebrow">{post.eyebrow}</p>
			<h1 class="gok-headline-1">{post.title}</h1>
			<p class="meta gok-body-small muted">{post.date} · {post.readingTime}</p>
		</header>

		<gok-divider></gok-divider>

		<div class="shell">
			<aside class="rail">
				<gok-toc spy accessible-label="On this page">
					{#each post.sections as section, i (section.id)}
						<gok-toc-item href="#{section.id}" current={i === 0 || undefined}>{section.heading}</gok-toc-item>
					{/each}
				</gok-toc>
			</aside>

			<article class="prose">
				{#each post.sections as section (section.id)}
					<section id={section.id} class="block">
						<h2 class="gok-headline-4">{section.heading}</h2>
						{#each section.body as para (para)}
							<p class="gok-body-regular">{para}</p>
						{/each}
					</section>
				{/each}

				<p class="back">
					<gok-link href="/journal">← All field notes</gok-link>
				</p>
			</article>
		</div>
	{/if}
</div>

<style>
	.post-page {
		padding-block: var(--gok-space-600) var(--gok-space-section-gap);
	}

	.head {
		display: grid;
		gap: var(--gok-space-200);
		margin-block: var(--gok-space-400) var(--gok-space-500);
		max-inline-size: 60ch;
	}

	.meta,
	.muted {
		color: var(--gok-color-text-muted);
	}

	.shell {
		display: grid;
		grid-template-columns: 14rem minmax(0, 1fr);
		gap: var(--gok-space-700);
		align-items: start;
		margin-block-start: var(--gok-space-600);
	}

	.rail {
		position: sticky;
		inset-block-start: var(--gok-space-600);
	}

	.prose {
		max-inline-size: 68ch;
	}

	.block {
		margin-block-end: var(--gok-space-700);
		scroll-margin-block-start: var(--gok-space-800);
	}

	.block h2 {
		margin-block-end: var(--gok-space-300);
	}

	.block p {
		margin-block: 0 var(--gok-space-300);
		color: var(--gok-color-text);
	}

	.back {
		margin-block-start: var(--gok-space-700);
		padding-block-start: var(--gok-space-400);
		border-block-start: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	@media (max-width: 56rem) {
		.shell {
			grid-template-columns: 1fr;
		}

		.rail {
			position: static;
		}
	}
</style>

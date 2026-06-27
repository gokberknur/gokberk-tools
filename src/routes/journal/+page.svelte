<script lang="ts">
	import { JOURNAL } from '$lib/data';
</script>

<svelte:head><title>Journal — gökberk tools</title></svelte:head>

<div class="journal band__inner">
	<gok-breadcrumb label="Breadcrumb">
		<gok-breadcrumb-item href="/">Home</gok-breadcrumb-item>
		<gok-breadcrumb-item>Journal</gok-breadcrumb-item>
	</gok-breadcrumb>

	<header class="head">
		<p class="gok-eyebrow">Journal</p>
		<h1 class="gok-headline-2">Field notes</h1>
		<p class="gok-body-intro lead">
			Tolerances, materials, and the occasional teardown — what we've learned at the machine.
		</p>
	</header>

	<ul class="posts">
		{#each JOURNAL as post (post.id)}
			<li class="post">
				<p class="gok-eyebrow">{post.eyebrow}</p>
				<h2 class="gok-headline-4">
					<a class="title" href="/journal/{post.id}">{post.title}</a>
				</h2>
				<p class="excerpt gok-body-regular">{post.excerpt}</p>
				<p class="meta gok-body-small muted">{post.date} · {post.readingTime}</p>
			</li>
		{/each}
	</ul>
</div>

<style>
	.journal {
		padding-block: var(--gok-space-600) var(--gok-space-section-gap);
	}

	.head {
		display: grid;
		gap: var(--gok-space-200);
		margin-block: var(--gok-space-400) var(--gok-space-700);
		max-inline-size: 60ch;
	}

	.lead {
		color: var(--gok-color-text-muted);
	}

	.posts {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--gok-space-700);
		max-inline-size: 60ch;
	}

	.post {
		display: grid;
		gap: var(--gok-space-200);
		padding-block-end: var(--gok-space-600);
		border-block-end: var(--gok-border-width-hairline) solid var(--gok-color-border);
	}

	.title {
		color: var(--gok-color-text);
		text-decoration: none;
	}

	.title:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.excerpt {
		color: var(--gok-color-text-muted);
	}

	.muted {
		color: var(--gok-color-text-muted);
	}
</style>

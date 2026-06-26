<script lang="ts">
	import { FAQ } from '$lib/data';
</script>

<svelte:head><title>Support — gökberk tools</title></svelte:head>

<div class="support gok-container">
	<gok-breadcrumb label="Breadcrumb">
		<gok-breadcrumb-item href="/">Home</gok-breadcrumb-item>
		<gok-breadcrumb-item>Support</gok-breadcrumb-item>
	</gok-breadcrumb>

	<header class="head">
		<p class="gok-eyebrow">Support</p>
		<h1 class="gok-headline-2">How can we help?</h1>
	</header>

	<gok-alert status="info">
		<span slot="title">Support hours</span>
		Engineers are on the line Monday to Friday, 8:00–17:00 CET.
	</gok-alert>

	<div class="shell">
		<aside class="rail">
			<gok-toc spy accessible-label="On this page">
				<gok-toc-item href="#contact" current>Contact</gok-toc-item>
				{#each FAQ as group (group.id)}
					<gok-toc-item href="#{group.id}">{group.heading}</gok-toc-item>
				{/each}
			</gok-toc>
		</aside>

		<div class="content">
			<section id="contact" class="section">
				<h2 class="gok-headline-4">Talk to us</h2>
				<p class="gok-body-regular measure">
					Between grades, or sizing a job? An engineer will read your setup and recommend a tool.
					Typical
					<gok-tooltip placement="top">
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<button class="term" type="button">lead time</button>
						<span slot="content">From order to dispatch for made-to-order tools — usually 3 business days.</span>
					</gok-tooltip>
					on a recommendation is one business day.
				</p>
				<div class="contact-row">
					<gok-link href="mailto:hello@gokberk.tools">hello@gokberk.tools</gok-link>
					<gok-popover placement="bottom">
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<gok-button variant="secondary">Contact options</gok-button>
						<span slot="heading">Reach an engineer</span>
						<div slot="content" class="options">
							<p class="options__row"><span class="options__k gok-eyebrow">Email</span> hello@gokberk.tools</p>
							<p class="options__row"><span class="options__k gok-eyebrow">Phone</span> +46 8 000 00 00</p>
							<p class="options__row"><span class="options__k gok-eyebrow">Hours</span> Mon–Fri, 8–17 CET</p>
						</div>
					</gok-popover>
				</div>
			</section>

			{#each FAQ as group (group.id)}
				<section id={group.id} class="section">
					<h2 class="gok-headline-4">{group.heading}</h2>
					<gok-accordion>
						{#each group.items as item (item.q)}
							<gok-accordion-item>
								<span slot="summary">{item.q}</span>
								<p class="gok-body-regular measure">{item.a}</p>
							</gok-accordion-item>
						{/each}
					</gok-accordion>
				</section>
			{/each}
		</div>
	</div>
</div>

<style>
	.support {
		padding-block: var(--gok-space-600) var(--gok-space-section-gap);
	}

	.head {
		display: grid;
		gap: var(--gok-space-100);
		margin-block: var(--gok-space-400) var(--gok-space-500);
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

	.section {
		margin-block-end: var(--gok-space-800);
		scroll-margin-block-start: var(--gok-space-800);
	}

	.section h2 {
		margin-block-end: var(--gok-space-400);
	}

	.measure {
		max-inline-size: 64ch;
		color: var(--gok-color-text-muted);
	}

	.contact-row {
		display: flex;
		align-items: center;
		gap: var(--gok-space-400);
		margin-block-start: var(--gok-space-400);
	}

	.term {
		appearance: none;
		border: 0;
		background: none;
		padding: 0;
		font: inherit;
		color: var(--gok-color-text);
		text-decoration: underline dotted;
		text-underline-offset: 0.2em;
		cursor: help;
	}

	.options {
		display: grid;
		gap: var(--gok-space-200);
		max-inline-size: 16rem;
	}

	.options__row {
		margin: 0;
		display: grid;
		gap: var(--gok-space-100);
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

<script setup lang="ts">
import { computed, useId } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { defineSchema, Card, $ } from '@bagelink/vue'
import { linkAttrs, mediaUrl, type MediaProp } from '@/utils/media'

interface CardItem {
	image?: MediaProp
	alt?: string
	title?: string
	body?: string
	href?: string
}
interface Props {
	eyebrow?: string
	heading?: string
	intro?: string
	columns?: string
	cards?: CardItem[]
}

const schema = defineSchema<Props>({
	eyebrow: $.text('Eyebrow', { placeholder: 'What we do' }),
	heading: $.text('Heading', { default: 'Everything we work with' }),
	intro: $.textarea('Intro'),
	columns: $.text('Columns', { default: '3', helpText: '2, 3 or 4 columns on desktop.' }),
	cards: $.array('Cards', defineSchema({
		image: $.upload('Image', { accept: 'image/*' }),
		alt: $.text('Image description', {
			required: true,
			helpText: 'Describe the image for screen readers. Required whenever an image is set.',
		}).if('image'),
		title: $.text('Title', { required: true, placeholder: 'Diamonds' }),
		body: $.textarea('Body', { placeholder: 'A short, specific description.' }),
		href: $.text('Link', { placeholder: '/diamonds or https://…' }),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'CardGrid',
	label: 'Card grid',
	icon: 'view_module',
	category: 'content',
	order: 50,
	description: 'A grid of image cards — categories, products, services or portfolio work.',
	schema,
	defaults: {
		columns: '3',
		cards: [
			{ title: 'Diamonds', body: 'Certified loose stones over one carat.' },
			{ title: 'Jewellery', body: 'Rings, necklaces, bracelets and earrings.' },
			{ title: 'Gemstones', body: 'Emeralds, rubies and sapphires.' },
		],
	},
})

const props = defineProps<Props>()

const headingId = useId()
const hasHeading = computed(() => Boolean(props.heading || props.eyebrow))
const rows = computed(() => (props.cards ?? []).filter((c) => c?.title || c?.body || mediaUrl(c?.image)))
const columnClass = computed(() => {
	const n = String(props.columns ?? '3').trim()
	return ['2', '3', '4'].includes(n) ? `grid-wrap-${n}` : 'grid-wrap-3'
})
</script>

<template>
	<section
		v-if="rows.length"
		class="blk-cards py-5 px-2 m_px-1 m_py-3"
		:aria-labelledby="hasHeading ? headingId : undefined"
	>
		<div class="w-1100px mx-auto">
			<div v-if="hasHeading || intro" class="txt-center mb-3 m_mb-2">
				<p v-if="eyebrow" class="txt12 uppercase tracking-wider color-primary semi mb-05">
					{{ eyebrow }}
				</p>
				<h2
					v-if="heading"
					:id="headingId"
					class="txt-40 m-0 balance m_txt-28 line-height-11"
				>
					{{ heading }}
				</h2>
				<p v-if="intro" class="txt-16 opacity-7 m-0 pretty mx-auto pt-05 w-700px m_w-100p">
					{{ intro }}
				</p>
			</div>

			<ul
				class="blk-cards__list grid gap-1-5 m_grid-wrap-1 m_gap-1 m-0 p-0 list-none"
				:class="[columnClass]"
			>
				<li v-for="(card, i) in rows" :key="card.title ?? i" v-reveal="{ delay: i * 70 }">
					<Card class="blk-cards__card p-0 overflow-hidden h-100p grid">
						<div v-if="mediaUrl(card.image)" class="blk-cards__media ratio-4-3">
							<img
								:src="mediaUrl(card.image)"
								:alt="card.alt || ''"
								loading="lazy"
								decoding="async"
								class="w-100p h-100p object-fit-cover"
							>
						</div>
						<div class="p-1 grid gap-025 align-content-start">
							<h3 class="txt18 semi m-0">
								<a
									v-if="card.href"
									class="blk-cards__link decoration-none color-inherit"
									v-bind="linkAttrs(card.href)"
								>{{ card.title }}</a>
								<template v-else>{{ card.title }}</template>
							</h3>
							<p v-if="card.body" class="txt14 opacity-6 line-height-15 m-0">
								{{ card.body }}
							</p>
						</div>
					</Card>
				</li>
			</ul>
		</div>
	</section>
</template>

<style scoped>
.blk-cards__list {
	list-style: none;
	margin-block: 0;
}

.blk-cards__media {
	overflow: hidden;
}

.blk-cards__card {
	transition: transform 0.25s ease;
}

/* Visible focus for keyboard users on the card's only interactive element. */
.blk-cards__link:focus-visible {
	outline: 2px solid var(--bgl-primary);
	outline-offset: 2px;
	border-radius: 2px;
}

@media (hover: hover) {
	.blk-cards__card:hover {
		transform: translateY(-3px);
	}
}

@media (prefers-reduced-motion: reduce) {
	.blk-cards__card {
		transition: none;
	}
}
</style>

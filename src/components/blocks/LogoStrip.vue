<script setup lang="ts">
import { computed, useId } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'
import { linkAttrs, mediaUrl, type MediaProp } from '@/utils/media'

interface Logo {
	name?: string
	image?: MediaProp
	href?: string
}
interface Props {
	heading?: string
	logos?: Logo[]
}

const schema = defineSchema<Props>({
	heading: $.text('Heading', {
		placeholder: 'Trusted by',
		helpText: 'Optional. Rendered small above the row.',
	}),
	logos: $.array('Logos', defineSchema({
		name: $.text('Name', {
			required: true,
			helpText: 'Used as the image alt text and as a fallback when no image is set.',
		}),
		image: $.upload('Logo', { accept: 'image/*', helpText: 'SVG or transparent PNG works best.' }),
		href: $.text('Link', { placeholder: 'https://…' }),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'LogoStrip',
	label: 'Logo strip',
	icon: 'workspaces',
	category: 'content',
	order: 60,
	description: 'A quiet row of client, partner or certification logos.',
	schema,
	defaults: {
		logos: [
			{ name: 'GIA' },
			{ name: 'IGI' },
			{ name: 'HRD' },
			{ name: 'SSEF' },
		],
	},
})

const props = defineProps<Props>()

const headingId = useId()
const rows = computed(() => (props.logos ?? []).filter((l) => l?.name || mediaUrl(l?.image)))
</script>

<template>
	<section
		v-if="rows.length"
		class="blk-logos py-4 px-2 m_px-1"
		:aria-labelledby="heading ? headingId : undefined"
	>
		<div class="w-1100px mx-auto txt-center">
			<h2 v-if="heading" :id="headingId" class="txt13 uppercase tracking-wider opacity-6 m-0 mb-2">
				{{ heading }}
			</h2>

			<ul class="blk-logos__list flex flex-wrap gap-3 m_gap-1-5 justify-content-center align-items-center m-0 p-0 list-none">
				<li v-for="(logo, i) in rows" :key="logo.name ?? i" v-reveal="{ delay: i * 50 }">
					<component
						:is="logo.href ? 'a' : 'div'"
						class="blk-logos__item flex align-items-center justify-content-center opacity-6"
						v-bind="logo.href ? linkAttrs(logo.href, { newTab: true }) : {}"
					>
						<img
							v-if="mediaUrl(logo.image)"
							:src="mediaUrl(logo.image)"
							:alt="logo.name || ''"
							loading="lazy"
							decoding="async"
							class="blk-logos__img object-fit-contain"
						>
						<span v-else class="txt16 semi">{{ logo.name }}</span>
					</component>
				</li>
			</ul>
		</div>
	</section>
</template>

<style scoped>
.blk-logos__list {
	list-style: none;
	margin-block: 0;
}

.blk-logos__img {
	max-height: 2.25rem;
	max-width: 7.5rem;
	width: auto;
}

.blk-logos__item {
	transition: opacity 0.2s ease;
}

@media (hover: hover) {
	.blk-logos__item:hover {
		opacity: 1;
	}
}

@media (prefers-reduced-motion: reduce) {
	.blk-logos__item {
		transition: none;
	}
}
</style>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { Btn, defineSchema, $ } from '@bagelink/vue'
import { linkAttrs, mediaUrl, type MediaProp } from '@/utils/media'

interface Props {
	eyebrow?: string
	title?: string
	subtitle?: string
	image?: MediaProp
	imageAlt?: string
	primaryLabel?: string
	primaryHref?: string
	secondaryLabel?: string
	secondaryHref?: string
	note?: string
}

const schema = defineSchema<Props>({
	eyebrow: $.text('Eyebrow', { placeholder: 'Certified since 1983' }),
	title: $.text('Title', { required: true, default: 'A headline that earns the scroll' }),
	subtitle: $.textarea('Subtitle', {
		default: 'One clear sentence on what you do, who it is for, and why it is worth their time.',
	}),
	image: $.upload('Image', {
		accept: 'image/*',
		helpText: 'Optional. Shown beside the copy; leave empty for a centred hero.',
	}),
	imageAlt: $.text('Image description', {
		required: true,
		helpText: 'Describe the image for screen readers. Required whenever an image is set.',
	}).if('image'),
	primaryLabel: $.text('Primary button label', { default: 'Get started' }),
	primaryHref: $.text('Primary button link', { placeholder: '/contact' }),
	secondaryLabel: $.text('Secondary button label'),
	secondaryHref: $.text('Secondary button link', { placeholder: 'https://…' }),
	note: $.text('Small print', { placeholder: 'No obligation · Confidential' }),
})

defineBlock({
	name: 'Hero',
	label: 'Hero',
	icon: 'home',
	category: 'hero',
	order: 10,
	description: 'Opening section: headline, supporting copy, optional image and calls to action.',
	schema,
})

const props = defineProps<Props>()

const titleId = useId()
const imageSrc = computed(() => mediaUrl(props.image))
const hasImage = computed(() => imageSrc.value !== '')
</script>

<template>
	<section
		class="blk-hero"
		:class="hasImage ? 'blk-hero--split' : 'blk-hero--centred'"
		:aria-labelledby="titleId"
	>
		<div class="blk-hero__inner w-1100px mx-auto px-2 m_px-1 py-5 m_py-3">
			<div class="blk-hero__grid grid grid-2-col m_grid-wrap-1 gap-3 m_gap-2 align-items-center">
				<div class="grid gap-1-5 align-content-center m_txt-center">
					<p v-if="eyebrow" class="txt12 uppercase tracking-wider semi color-primary m-0">
						{{ eyebrow }}
					</p>

					<h1 :id="titleId" class="txt-64 line-height-1 m-0 balance m_txt-40 m_line-height-11">
						{{ title }}
					</h1>

					<p v-if="subtitle" class="txt-20 opacity-8 line-height-15 m-0 pretty m_txt-16">
						{{ subtitle }}
					</p>

					<div
						v-if="primaryLabel || secondaryLabel"
						class="flex gap-1 pt-05 m_column m_justify-content-center"
					>
						<Btn
							v-if="primaryLabel"
							color="primary"
							size="lg"
							:value="primaryLabel"
							full-width-mobile
							v-bind="linkAttrs(primaryHref)"
						/>
						<Btn
							v-if="secondaryLabel"
							size="lg"
							:value="secondaryLabel"
							full-width-mobile
							v-bind="linkAttrs(secondaryHref)"
						/>
					</div>

					<p v-if="note" class="txt12 opacity-5 m-0">{{ note }}</p>
				</div>

				<div v-if="hasImage" class="blk-hero__media radius-2 overflow-hidden">
					<!-- Hero art is the LCP candidate: eager + high priority, never lazy. -->
					<img
						:src="imageSrc"
						:alt="imageAlt || ''"
						width="1200"
						height="900"
						loading="eager"
						fetchpriority="high"
						decoding="async"
						class="w-100p h-100p object-fit-cover"
					>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.blk-hero__media {
	aspect-ratio: 4 / 3;
}

/* The split layout is a two-column grid only where the image exists. */
.blk-hero--centred .blk-hero__grid {
	grid-template-columns: minmax(0, 1fr);
	max-width: 52rem;
	margin-inline: auto;
}

@media screen and (max-width: 910px) {
	.blk-hero__media {
		aspect-ratio: 16 / 9;
	}
}
</style>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { defineSchema, Icon, $ } from '@bagelink/vue'

interface Feature {
	icon?: string
	title?: string
	body?: string
}
interface Props {
	eyebrow?: string
	heading?: string
	intro?: string
	columns?: string
	features?: Feature[]
}

const schema = defineSchema<Props>({
	eyebrow: $.text('Eyebrow', { placeholder: 'Why us' }),
	heading: $.text('Heading', { default: 'Built around what matters to you' }),
	intro: $.textarea('Intro'),
	columns: $.text('Columns', {
		default: '3',
		helpText: 'How many columns on desktop: 2, 3 or 4. Stacks on mobile.',
	}),
	features: $.array('Features', defineSchema({
		icon: $.icon('Icon', { default: 'check_circle' }),
		title: $.text('Title', { required: true, placeholder: 'No obligation' }),
		body: $.textarea('Body', { placeholder: 'One sentence of supporting detail.' }),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'FeatureGrid',
	label: 'Feature grid',
	icon: 'grid_view',
	category: 'content',
	order: 40,
	description: 'A grid of short icon-led value points — three or four reads best.',
	schema,
	defaults: {
		columns: '3',
		features: [
			{ icon: 'shield', title: 'No obligation', body: 'Change your mind at any point before you confirm.' },
			{ icon: 'payments', title: 'Zero cost', body: 'Evaluation, photography and shipping are all included.' },
			{ icon: 'groups', title: 'Competitive network', body: 'A wide buyer network competes for your item.' },
			{ icon: 'lock', title: 'Secure payment', body: 'Funds are released directly and without waiting.' },
		],
	},
})

const props = defineProps<Props>()

const headingId = useId()
const hasHeading = computed(() => Boolean(props.heading || props.eyebrow))
const rows = computed(() => (props.features ?? []).filter((f) => f?.title || f?.body))
const columnClass = computed(() => {
	const n = String(props.columns ?? '3').trim()
	return ['2', '3', '4'].includes(n) ? `grid-wrap-${n}` : 'grid-wrap-3'
})
</script>

<template>
	<section
		v-if="rows.length"
		class="blk-features py-5 px-2 m_px-1 m_py-3"
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
				class="blk-features__list grid gap-1-5 m_grid-wrap-1 m_gap-1 m-0 p-0 list-none"
				:class="[columnClass]"
			>
				<li
					v-for="(feature, i) in rows"
					:key="feature.title ?? i"
					class="grid gap-05 align-content-start"
					v-reveal="{ delay: i * 70 }"
				>
					<!-- Decorative: the adjacent title carries the meaning. -->
					<Icon
						v-if="feature.icon"
						:name="feature.icon"
						class="color-primary"
						:size="1.4"
						aria-hidden="true"
					/>
					<p class="txt17 semi m-0">{{ feature.title }}</p>
					<p v-if="feature.body" class="txt14 opacity-6 line-height-15 m-0">{{ feature.body }}</p>
				</li>
			</ul>
		</div>
	</section>
</template>

<style scoped>
.blk-features__list {
	list-style: none;
	margin-block: 0;
}
</style>

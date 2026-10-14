<script setup lang="ts">
import { computed, useId } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { defineSchema, Icon, sanitizeHtml, $ } from '@bagelink/vue'

interface Testimonial {
	quote?: string
	author?: string
	context?: string
}
interface Props {
	eyebrow?: string
	heading?: string
	intro?: string
	columns?: string
	testimonials?: Testimonial[]
}

const schema = defineSchema<Props>({
	eyebrow: $.text('Eyebrow', { placeholder: 'In their words' }),
	heading: $.text('Heading', { default: 'What clients say' }),
	intro: $.textarea('Intro'),
	columns: $.text('Columns', { default: '2', helpText: '2 or 3 columns on desktop.' }),
	testimonials: $.array('Testimonials', defineSchema({
		quote: $.richtext('Quote', { required: true, basic: true, placeholder: 'What the client said.' }),
		author: $.text('Author', { required: true, placeholder: 'Deborah' }),
		context: $.text('Context', { placeholder: 'Antwerp, 2025' }),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'TestimonialList',
	label: 'Testimonials',
	icon: 'format_quote',
	category: 'content',
	order: 90,
	description: 'Client quotes with attribution — the strongest trust signal on a page.',
	schema,
	defaults: {
		columns: '2',
		testimonials: [
			{ quote: 'Professional, efficient and genuinely helpful from start to finish.', author: 'Deborah', context: 'Antwerp, 2025' },
			{ quote: 'Their guidance helped us reach exactly the right decision.', author: 'John & Cecile' },
		],
	},
})

const props = defineProps<Props>()

const headingId = useId()
const hasHeading = computed(() => Boolean(props.heading || props.eyebrow))
const rows = computed(() => (props.testimonials ?? []).filter((t) => t?.quote && t?.author))
const columnClass = computed(() => {
	const n = String(props.columns ?? '2').trim()
	return ['2', '3'].includes(n) ? `grid-wrap-${n}` : 'grid-wrap-2'
})
</script>

<template>
	<section
		v-if="rows.length"
		class="blk-quotes py-5 px-2 m_px-1 m_py-3"
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
				class="blk-quotes__list grid gap-1-5 m_grid-wrap-1 m_gap-1 m-0 p-0 list-none"
				:class="[columnClass]"
			>
				<!-- figure/blockquote/figcaption is the correct pairing for a quote + attribution. -->
				<li v-for="(item, i) in rows" :key="item.author ?? i" v-reveal="{ delay: i * 70 }">
					<figure class="blk-quotes__card grid gap-1 m-0 p-1-5 radius-2 bg-box h-100p align-content-between">
						<Icon name="format_quote" class="color-primary opacity-4" :size="1.6" aria-hidden="true" />
						<blockquote class="blk-quotes__quote txt17 line-height-15 pretty m-0">
							<!-- Authored as richtext: sanitized before render. -->
							<div v-html="sanitizeHtml(item.quote ?? '')" />
						</blockquote>
						<figcaption class="grid gap-01">
							<span class="semi txt14">{{ item.author }}</span>
							<span v-if="item.context" class="txt12 opacity-5">{{ item.context }}</span>
						</figcaption>
					</figure>
				</li>
			</ul>
		</div>
	</section>
</template>

<style scoped>
.blk-quotes__list {
	list-style: none;
	margin-block: 0;
}

.blk-quotes__quote {
	font-style: normal;
}
</style>

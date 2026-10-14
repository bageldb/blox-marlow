<script setup lang="ts">
import { computed, useId } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Stat {
	value?: string
	label?: string
}
interface Props {
	eyebrow?: string
	heading?: string
	items?: Stat[]
}

const schema = defineSchema<Props>({
	eyebrow: $.text('Eyebrow', { placeholder: 'By the numbers' }),
	heading: $.text('Heading', { placeholder: 'Why sellers choose us' }),
	items: $.array('Stats', defineSchema({
		value: $.text('Value', { required: true, placeholder: '40+' }),
		label: $.text('Label', { required: true, placeholder: 'Years of craftsmanship' }),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'StatsStrip',
	label: 'Stats',
	icon: 'insights',
	category: 'content',
	order: 20,
	description: 'A short row of headline numbers with labels — proof points under a hero.',
	schema,
	defaults: {
		items: [
			{ value: '40+', label: 'Years of craftsmanship' },
			{ value: '4,200+', label: 'Clients worldwide' },
			{ value: '72h', label: 'Average time to offer' },
			{ value: '100%', label: 'Free to sellers' },
		],
	},
})

const props = defineProps<Props>()

const headingId = useId()
const hasHeading = computed(() => Boolean(props.heading || props.eyebrow))
const rows = computed(() => (props.items ?? []).filter((s) => s?.value || s?.label))
</script>

<template>
	<section
		v-if="rows.length"
		class="blk-stats py-5 px-2 m_px-1 m_py-3"
		:aria-labelledby="hasHeading ? headingId : undefined"
	>
		<div class="w-1100px mx-auto">
			<div v-if="hasHeading" class="txt-center mb-3 m_mb-2">
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
			</div>

			<!--
				A description list: each stat is a label/value pair, which is exactly
				its semantic relationship. `column-reverse` puts the number above the
				label visually without reordering the DOM (`dt` must precede `dd`).
			-->
			<dl class="blk-stats__list w-100p grid grid-wrap-4 gap-1 m_grid-wrap-2 m_gap-1 m-0">
				<div
					v-for="(stat, i) in rows"
					:key="stat.label ?? i"
					class="flex column-reverse gap-025 txt-center py-1"
					v-reveal="{ delay: i * 60 }"
				>
					<dt class="txt13 opacity-6">{{ stat.label }}</dt>
					<dd class="blk-stats__value txt-40 line-height-1 color-primary m_txt-28 m-0">
						{{ stat.value }}
					</dd>
				</div>
			</dl>
		</div>
	</section>
</template>

<style scoped>
.blk-stats__list {
	margin-block: 0;
}

.blk-stats__value {
	font-variant-numeric: tabular-nums;
}
</style>

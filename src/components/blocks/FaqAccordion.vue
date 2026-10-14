<script setup lang="ts">
import { computed, useId } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { Accordion, AccordionItem, defineSchema, sanitizeHtml, $ } from '@bagelink/vue'

interface Faq {
	question?: string
	answer?: string
}
interface Props {
	eyebrow?: string
	heading?: string
	intro?: string
	faqs?: Faq[]
}

const schema = defineSchema<Props>({
	eyebrow: $.text('Eyebrow', { placeholder: 'FAQ' }),
	heading: $.text('Heading', { default: 'Common questions' }),
	intro: $.textarea('Intro'),
	faqs: $.array('Questions', defineSchema({
		question: $.text('Question', { required: true, placeholder: 'What does it cost?' }),
		answer: $.richtext('Answer', { required: true, basic: true }),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'FaqAccordion',
	label: 'FAQ',
	icon: 'help_center',
	category: 'content',
	order: 70,
	description: 'An accordion of questions and answers — reduces objections before the close.',
	schema,
	defaults: {
		faqs: [
			{ question: 'What does it cost?', answer: 'Our service is free: evaluation, photography and shipping are included.' },
			{ question: 'Am I obliged to accept?', answer: 'Never. You can walk away at any point before you confirm.' },
			{ question: 'How long does it take?', answer: 'Most items receive an offer within a few days of review.' },
		],
	},
})

const props = defineProps<Props>()

const headingId = useId()
const hasHeading = computed(() => Boolean(props.heading || props.eyebrow))
const rows = computed(() => (props.faqs ?? []).filter((f) => f?.question && f?.answer))
</script>

<template>
	<section
		v-if="rows.length"
		class="blk-faq py-5 px-2 m_px-1 m_py-3"
		:aria-labelledby="hasHeading ? headingId : undefined"
	>
		<div class="w-900px mx-auto">
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
				<p v-if="intro" class="txt-16 opacity-7 m-0 pretty mx-auto pt-05">
					{{ intro }}
				</p>
			</div>

			<Accordion>
				<AccordionItem
					v-for="(faq, i) in rows"
					:key="faq.question ?? i"
					:label="faq.question"
					v-reveal="{ delay: i * 60 }"
				>
					<!-- Answer is richtext authored in the editor: sanitized before render. -->
					<div class="opacity-7 line-height-15 pretty" v-html="sanitizeHtml(faq.answer ?? '')" />
				</AccordionItem>
			</Accordion>
		</div>
	</section>
</template>

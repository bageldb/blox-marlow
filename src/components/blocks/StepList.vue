<script setup lang="ts">
import { computed, useId } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { Avatar, defineSchema, $ } from '@bagelink/vue'

interface Step {
	icon?: string
	title?: string
	body?: string
}
interface Props {
	eyebrow?: string
	heading?: string
	intro?: string
	steps?: Step[]
}

const schema = defineSchema<Props>({
	eyebrow: $.text('Eyebrow', { placeholder: 'How it works' }),
	heading: $.text('Heading', { default: 'Four steps to the best offer' }),
	intro: $.textarea('Intro'),
	steps: $.array('Steps', defineSchema({
		icon: $.icon('Icon', { default: 'check' }),
		title: $.text('Title', { required: true, placeholder: 'Tell us about your items' }),
		body: $.textarea('Body', { placeholder: 'What happens at this step.' }),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'StepList',
	label: 'Steps',
	icon: 'format_list_numbered',
	category: 'content',
	order: 30,
	description: 'An ordered, numbered walkthrough of how something works.',
	schema,
	defaults: {
		steps: [
			{ icon: 'photo_camera', title: 'Share the details', body: 'Send photos and a few specifics through a short online form.' },
			{ icon: 'workspace_premium', title: 'Expert review', body: 'A specialist reviews your item and explains the options.' },
			{ icon: 'trending_up', title: 'Receive an offer', body: 'Your item is presented to a network of buyers to reach the best offer.' },
			{ icon: 'verified', title: 'Get paid', body: 'Once accepted and verified, payment is released straight away.' },
		],
	},
})

const props = defineProps<Props>()

const headingId = useId()
const hasHeading = computed(() => Boolean(props.heading || props.eyebrow))
const rows = computed(() => (props.steps ?? []).filter((s) => s?.title || s?.body))
</script>

<template>
	<section
		v-if="rows.length"
		class="blk-steps py-5 px-2 m_px-1 m_py-3"
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

			<!-- Ordered list: the sequence is meaningful, so expose it as one. -->
			<ol class="blk-steps__list grid grid-wrap-4 gap-1-5 m_grid-wrap-1 m_gap-1 m-0 p-0 list-none">
				<li
					v-for="(step, i) in rows"
					:key="step.title ?? i"
					class="grid gap-075 align-content-start"
					v-reveal="{ delay: i * 80 }"
				>
					<!-- Decorative: the step number and title carry the meaning. -->
					<Avatar
						v-if="step.icon"
						square
						color="primary"
						:icon="step.icon"
						:size="48"
						aria-hidden="true"
					/>
					<span class="txt12 uppercase tracking-wider color-primary opacity-7">
						Step {{ i + 1 }}
					</span>
					<p class="txt18 semi m-0 line-height-12">{{ step.title }}</p>
					<p v-if="step.body" class="opacity-6 line-height-15 m-0">{{ step.body }}</p>
				</li>
			</ol>
		</div>
	</section>
</template>

<style scoped>
.blk-steps__list {
	list-style: none;
	margin-block: 0;
}
</style>

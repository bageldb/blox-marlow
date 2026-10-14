<script setup lang="ts">
import { computed, useId } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { Btn, Card, defineSchema, $ } from '@bagelink/vue'
import { linkAttrs } from '@/utils/media'

interface Props {
	heading?: string
	body?: string
	primaryLabel?: string
	primaryHref?: string
	secondaryLabel?: string
	secondaryHref?: string
	note?: string
}

const schema = defineSchema<Props>({
	heading: $.text('Heading', { required: true, default: 'Ready to discover what it is worth?' }),
	body: $.textarea('Body', { default: 'Talk to us — free, confidential and with no obligation.' }),
	primaryLabel: $.text('Primary button label', { default: 'Get started' }),
	primaryHref: $.text('Primary button link', { placeholder: '/contact' }),
	secondaryLabel: $.text('Secondary button label'),
	secondaryHref: $.text('Secondary button link', { placeholder: 'https://…' }),
	note: $.text('Small print'),
})

defineBlock({
	name: 'CallToAction',
	label: 'Call to action',
	icon: 'campaign',
	category: 'content',
	order: 100,
	description: 'A closing banner with a strong ask — typically the last section on a page.',
	schema,
})

const props = defineProps<Props>()

const headingId = useId()
const hasActions = computed(() => Boolean(props.primaryLabel || props.secondaryLabel))
</script>

<template>
	<section
		v-if="heading"
		class="blk-cta px-2 m_px-1 pb-2 m_pb-1"
		:aria-labelledby="headingId"
	>
		<Card
			color="primary"
			gradient
			class="blk-cta__card w-1000px mx-auto txt-center py-5 m_py-2 color-white radius-2 relative overflow-hidden border-none"
		>
			<div class="relative z-2 px-2 m_px-1">
				<h2
					:id="headingId"
					class="txt-40 m-0 balance m_txt-28 line-height-11"
				>
					{{ heading }}
				</h2>

				<p
					v-if="body"
					class="txt17 opacity-8 pretty w-560px mx-auto m_w-100p pt-05 mb-2"
				>
					{{ body }}
				</p>

				<div
					v-if="hasActions"
					class="flex gap-1 justify-content-center m_column"
				>
					<Btn
						v-if="primaryLabel"
						size="lg"
						:value="primaryLabel"
						full-width-mobile
						v-bind="linkAttrs(primaryHref)"
					/>
					<Btn
						v-if="secondaryLabel"
						size="lg"
						outline
						:value="secondaryLabel"
						full-width-mobile
						v-bind="linkAttrs(secondaryHref)"
					/>
				</div>

				<p v-if="note" class="txt12 opacity-6 m-0 pt-1">{{ note }}</p>
			</div>
		</Card>
	</section>
</template>

<style scoped>
/* The banner sits on a coloured surface, so its buttons must invert. */
.blk-cta__card :deep(.bgl_btn) {
	--bgl-btn-bg: white;
	--bgl-btn-color: var(--bgl-primary);
}
</style>

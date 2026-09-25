<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Props {
	body?: string
}
const schema = defineSchema<Props>({
	body: $.richtext('Content', { required: true, default: 'Hello, world!' }),
})

defineBlock({ name: 'TextBlock', label: 'Text Block', icon: 'article', schema })

const props = defineProps<Props>()
</script>

<template>
	<section class="text-block">
		<div>{{ props.body }}</div>
	</section>
</template>

<style scoped>
.text-block {
	max-width: 800px;
	margin: 2rem auto;
	padding: 0 1.5rem;
	line-height: 1.7;
}
</style>

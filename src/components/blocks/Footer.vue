<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'
interface Props {
	text?: string
}
const schema = defineSchema<Props>({
	text: $.text('Footer text', { required: true, default: '© ' + new Date().getFullYear() }),
})

defineBlock({ name: 'Footer', label: 'Footer', icon: 'bottom_navigation', schema })

const props = defineProps<Props>()
</script>

<template>
	<footer class="site-footer">
		<p>{{ props.text || `© ${new Date().getFullYear()}` }}</p>
	</footer>
</template>

<style scoped>
.site-footer {
	padding: 2rem;
	text-align: center;
	background: #f5f5f5;
	color: #666;
	font-size: 0.875rem;
}
</style>

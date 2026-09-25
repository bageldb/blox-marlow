<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Props {
	title?: string
	subtitle?: string
}
const schema = defineSchema<Props>({
	title: $.text('Title', { required: true, default: 'Welcome' }),
	subtitle: $.text('Subtitle', { required: false }),
})

defineBlock({ name: 'Hero', label: 'Hero', icon: 'home', schema })

defineProps<{
	title?: string
	subtitle?: string
}>()
</script>

<template>
	<section class="hero">
		<h1>{{ title || 'Welcome' }}</h1>
		<p v-if="subtitle">{{ subtitle }}</p>
	</section>
</template>

<style scoped>
.hero {
	padding: 4rem 2rem;
	text-align: center;
	background: var(--bgl-primary);
	color: white;
}
.hero h1 {
	font-size: 2.5rem;
	margin: 0 0 0.5rem;
}
.hero p {
	font-size: 1.25rem;
	opacity: 0.9;
}
</style>

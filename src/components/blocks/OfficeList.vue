<script setup lang="ts">
import { computed, useId } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { Card, defineSchema, Icon, $ } from '@bagelink/vue'

interface Office {
	city?: string
	address?: string
	note?: string
	phone?: string
	email?: string
}
interface Props {
	eyebrow?: string
	heading?: string
	intro?: string
	offices?: Office[]
}

const schema = defineSchema<Props>({
	eyebrow: $.text('Eyebrow', { placeholder: 'Our offices' }),
	heading: $.text('Heading', { default: 'Visit us in person' }),
	intro: $.textarea('Intro'),
	offices: $.array('Offices', defineSchema({
		city: $.text('City', { required: true, placeholder: 'Antwerp' }),
		address: $.textarea('Address', { placeholder: 'Hoveniersstraat 2, 2018 Antwerpen' }),
		note: $.text('Note', { placeholder: 'By appointment' }),
		phone: $.text('Phone', { placeholder: '+32 472 068 922' }),
		email: $.text('Email', { placeholder: 'hello@example.com' }),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'OfficeList',
	label: 'Offices',
	icon: 'location_city',
	category: 'content',
	order: 80,
	description: 'Contact details for one or more locations, with tel: and mailto: links.',
	schema,
	defaults: {
		offices: [
			{ city: 'Antwerp', address: 'Hoveniersstraat 2, 2018 Antwerpen, Belgium', note: 'Head office', phone: '+32 472 068 922', email: 'info@example.com' },
			{ city: 'London', address: '8–9 Greville St, London EC1N 8SB, United Kingdom', phone: '+44 7591 044179' },
		],
	},
})

const props = defineProps<Props>()

const headingId = useId()
const hasHeading = computed(() => Boolean(props.heading || props.eyebrow))
const rows = computed(() => (props.offices ?? []).filter((o) => o?.city))

/** tel: links must not contain spaces or punctuation. */
function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, '')}`
}
</script>

<template>
	<section
		v-if="rows.length"
		class="blk-offices py-5 px-2 m_px-1 m_py-3"
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

			<ul class="blk-offices__list grid grid-wrap-3 gap-1 m_grid-wrap-1 m-0 p-0 list-none">
				<li v-for="(office, i) in rows" :key="office.city ?? i" v-reveal="{ delay: i * 60 }">
					<Card thin frame class="grid gap-05 h-100p align-content-start">
						<div class="flex gap-05 align-items-center">
							<Icon
								name="location_on"
								class="color-primary"
								:size="1.2"
								aria-hidden="true"
							/>
							<h3 class="txt18 semi m-0">{{ office.city }}</h3>
						</div>

						<address v-if="office.address" class="blk-offices__address opacity-7 txt14 m-0 ps-2 line-height-15">
							{{ office.address }}
						</address>

						<p v-if="office.note" class="txt13 opacity-5 m-0 ps-2">{{ office.note }}</p>

						<p v-if="office.phone" class="m-0 ps-2 txt14">
							<a
								class="decoration-none color-primary"
								:href="telHref(office.phone)"
							>{{ office.phone }}</a>
						</p>
						<p v-if="office.email" class="m-0 ps-2 txt14">
							<a
								class="decoration-none color-primary"
								:href="`mailto:${office.email}`"
							>{{ office.email }}</a>
						</p>
					</Card>
				</li>
			</ul>
		</div>
	</section>
</template>

<style scoped>
.blk-offices__list {
	list-style: none;
	margin-block: 0;
}

/* `address` must not inherit the browser's italic default. */
.blk-offices__address {
	font-style: normal;
}

.blk-offices a:focus-visible {
	outline: 2px solid var(--bgl-primary);
	outline-offset: 2px;
	border-radius: 2px;
}
</style>

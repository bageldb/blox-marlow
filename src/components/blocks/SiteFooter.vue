<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { defineBlock, useGlobalBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'
import { isExternalUrl, mediaUrl, type MediaProp } from '@/utils/media'

interface FooterLink {
	label?: string
	href?: string
}
interface FooterColumn {
	title?: string
	links?: FooterLink[]
}
interface Props {
	brandName?: string
	tagline?: string
	logo?: MediaProp
	logoAlt?: string
	columns?: FooterColumn[]
	email?: string
	phone?: string
	copyright?: string
}

const schema = defineSchema<Props>({
	brandName: $.text('Brand name', { default: 'Your brand' }),
	tagline: $.textarea('Tagline', { placeholder: 'One line about the business.' }),
	logo: $.upload('Logo', { accept: 'image/*' }),
	logoAlt: $.text('Logo description', {
		placeholder: 'Company name',
		helpText: 'Defaults to the brand name when left empty.',
	}).if('logo'),
	columns: $.array('Link columns', defineSchema({
		title: $.text('Column title', { required: true, placeholder: 'Company' }),
		links: $.array('Links', defineSchema({
			label: $.text('Label', { required: true, placeholder: 'About' }),
			href: $.text('Link', { required: true, placeholder: '/about' }),
		}), { collapsible: true, allowReorder: true }),
	}), { collapsible: true, allowReorder: true }),
	email: $.text('Email', { placeholder: 'hello@example.com' }),
	phone: $.text('Phone', { placeholder: '+32 472 068 922' }),
	copyright: $.text('Copyright', { placeholder: '© 2026 Your brand' }),
})

defineBlock({
	name: 'SiteFooter',
	label: 'Site footer',
	icon: 'bottom_navigation',
	category: 'layout',
	order: 6,
	global: true,
	description: 'Site-wide footer with link columns and contact details. Global: shared across pages.',
	schema,
})

const props = defineProps<Props>()
const { data } = useGlobalBlock<Props>('SiteFooter')
const c = computed<Props>(() => ({ ...props, ...(data.value ?? {}) }))

const columns = computed(() =>
	(c.value.columns ?? [])
		.map((col) => ({ ...col, links: (col.links ?? []).filter((l) => l?.label && l?.href) }))
		.filter((col) => col.title || col.links.length),
)
const logoSrc = computed(() => mediaUrl(c.value.logo))
const brand = computed(() => c.value.brandName || '')
const logoAlt = computed(() => c.value.logoAlt || brand.value)
const telHref = computed(() => `tel:${(c.value.phone ?? '').replace(/[^\d+]/g, '')}`)
</script>

<template>
	<footer class="blk-footer bg-box border-top">
		<div class="w-1100px mx-auto px-2 m_px-1 py-4 grid gap-3">
			<div class="grid grid-wrap-250-fill gap-3 m_grid-wrap-1 m_gap-2">
				<div class="grid gap-05 align-content-start">
					<RouterLink to="/" class="flex align-items-center gap-05 decoration-none color-inherit">
						<img
							v-if="logoSrc"
							:src="logoSrc"
							:alt="logoAlt"
							class="blk-footer__logo object-fit-contain"
							height="28"
						>
						<span v-else class="txt17 semi">{{ brand }}</span>
					</RouterLink>
					<p v-if="c.tagline" class="txt14 opacity-6 pretty m-0 w-320px m_w-100p">
						{{ c.tagline }}
					</p>
					<div class="grid gap-025 pt-05 txt14">
						<a
							v-if="c.email"
							class="blk-footer__link decoration-none color-primary w-max-content"
							:href="`mailto:${c.email}`"
						>{{ c.email }}</a>
						<a
							v-if="c.phone"
							class="blk-footer__link decoration-none color-primary w-max-content"
							:href="telHref"
						>{{ c.phone }}</a>
					</div>
				</div>

				<nav
					v-if="columns.length"
					class="blk-footer__columns grid grid-wrap-200-fill gap-2 m_grid-wrap-2 m_gap-1-5"
					aria-label="Footer"
				>
					<div v-for="(col, i) in columns" :key="col.title ?? i" class="grid gap-05 align-content-start">
						<h2 v-if="col.title" class="txt12 uppercase tracking-wider semi m-0">{{ col.title }}</h2>
						<ul class="grid gap-025 m-0 p-0 list-none">
							<li v-for="link in col.links" :key="link.href">
								<RouterLink
									v-if="!isExternalUrl(link.href)"
									:to="link.href!"
									class="blk-footer__link txt14 opacity-7 decoration-none color-inherit"
								>{{ link.label }}</RouterLink>
								<a
									v-else
									:href="link.href"
									target="_blank"
									rel="noopener noreferrer"
									class="blk-footer__link txt14 opacity-7 decoration-none color-inherit"
								>{{ link.label }}</a>
							</li>
						</ul>
					</div>
				</nav>
			</div>

			<p v-if="c.copyright" class="txt12 opacity-5 m-0 pt-1 border-top">{{ c.copyright }}</p>
		</div>
	</footer>
</template>

<style scoped>
.blk-footer__logo {
	max-height: 1.75rem;
	width: auto;
}

.blk-footer__link:hover {
	opacity: 1;
}

.blk-footer__link:focus-visible {
	outline: 2px solid var(--bgl-primary);
	outline-offset: 3px;
	border-radius: 3px;
}
</style>

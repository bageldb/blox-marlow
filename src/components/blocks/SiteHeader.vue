<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { RouterLink } from 'vue-router'
import { defineBlock, useGlobalBlock } from '@bagelink/blox'
import { Btn, defineSchema, $ } from '@bagelink/vue'
import { isExternalUrl, linkAttrs, mediaUrl, type MediaProp } from '@/utils/media'

interface NavLink {
	label?: string
	href?: string
}
interface Props {
	brandName?: string
	logo?: MediaProp
	logoAlt?: string
	links?: NavLink[]
	ctaLabel?: string
	ctaHref?: string
}

const schema = defineSchema<Props>({
	brandName: $.text('Brand name', { default: 'Your brand' }),
	logo: $.upload('Logo', { accept: 'image/*', helpText: 'Optional. Falls back to the brand name.' }),
	logoAlt: $.text('Logo description', {
		placeholder: 'Company name',
		helpText: 'Defaults to the brand name when left empty.',
	}).if('logo'),
	links: $.array('Links', defineSchema({
		label: $.text('Label', { required: true, placeholder: 'About' }),
		href: $.text('Link', { required: true, placeholder: '/about' }),
	}), { collapsible: true, allowReorder: true }),
	ctaLabel: $.text('Button label', { placeholder: 'Contact us' }),
	ctaHref: $.text('Button link', { placeholder: '/contact' }),
})

defineBlock({
	name: 'SiteHeader',
	label: 'Site header',
	icon: 'web_asset',
	category: 'layout',
	order: 5,
	global: true,
	description: 'Site-wide navigation bar. Global: edited once, shared across every page.',
	schema,
})

const props = defineProps<Props>()
const { data } = useGlobalBlock<Props>('SiteHeader')
/** Global content wins; props are the designer's live preview. */
const c = computed<Props>(() => ({ ...props, ...(data.value ?? {}) }))

const navId = useId()
const open = ref(false)

const links = computed(() => (c.value.links ?? []).filter((l) => l?.label && l?.href))
const logoSrc = computed(() => mediaUrl(c.value.logo))
const brand = computed(() => c.value.brandName || '')
const logoAlt = computed(() => c.value.logoAlt || brand.value)
</script>

<template>
	<header class="blk-header sticky-0 z-10 bg-box border-bottom">
		<div class="w-1100px mx-auto px-2 m_px-1 py-075 flex space-between align-items-center gap-2">
			<RouterLink to="/" class="blk-header__brand flex align-items-center gap-05 decoration-none color-inherit">
				<img
					v-if="logoSrc"
					:src="logoSrc"
					:alt="logoAlt"
					class="blk-header__logo object-fit-contain"
					height="32"
				>
				<span v-else class="txt18 semi">{{ brand }}</span>
			</RouterLink>

			<nav class="blk-header__nav m_hide" aria-label="Main navigation">
				<ul class="flex gap-1-5 align-items-center m-0 p-0 list-none">
					<li v-for="link in links" :key="link.href">
						<RouterLink
							v-if="!isExternalUrl(link.href)"
							:to="link.href!"
							class="blk-header__link txt14 decoration-none color-inherit"
						>{{ link.label }}</RouterLink>
						<a
							v-else
							:href="link.href"
							target="_blank"
							rel="noopener noreferrer"
							class="blk-header__link txt14 decoration-none color-inherit"
						>{{ link.label }}</a>
					</li>
				</ul>
			</nav>

			<div class="flex align-items-center gap-05">
				<Btn
					v-if="c.ctaLabel"
					color="primary"
					thin
					:value="c.ctaLabel"
					class="m_hide"
					v-bind="linkAttrs(c.ctaHref)"
				/>
				<Btn
					v-if="links.length"
					flat
					thin
					icon="menu"
					:aria-expanded="open"
					:aria-controls="navId"
					:aria-label="open ? 'Close navigation' : 'Open navigation'"
					class="blk-header__toggle"
					@click="open = !open"
				/>
			</div>
		</div>

		<!-- Mobile disclosure: same links, exposed only when open. -->
		<nav v-if="links.length" :id="navId" class="blk-header__panel" :hidden="!open" aria-label="Main navigation">
			<ul class="grid gap-05 m-0 p-1 list-none">
				<li v-for="link in links" :key="link.href">
					<RouterLink
						v-if="!isExternalUrl(link.href)"
						:to="link.href!"
						class="blk-header__link block py-05 txt16 decoration-none color-inherit"
						@click="open = false"
					>{{ link.label }}</RouterLink>
					<a
						v-else
						:href="link.href"
						target="_blank"
						rel="noopener noreferrer"
						class="blk-header__link block py-05 txt16 decoration-none color-inherit"
						@click="open = false"
					>{{ link.label }}</a>
				</li>
			</ul>
		</nav>
	</header>
</template>

<style scoped>
.blk-header__logo {
	max-height: 2rem;
	width: auto;
}

.blk-header__toggle {
	display: none;
}

/* Above the mobile breakpoint both the toggle and the panel are hidden. */
@media screen and (max-width: 910px) {
	.blk-header__toggle {
		display: inline-flex;
	}
}

@media screen and (min-width: 911px) {
	.blk-header__panel {
		display: none;
	}
}

.blk-header__link:hover {
	opacity: 0.7;
}

.blk-header__link:focus-visible,
.blk-header__brand:focus-visible {
	outline: 2px solid var(--bgl-primary);
	outline-offset: 3px;
	border-radius: 3px;
}
</style>

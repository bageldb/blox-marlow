/**
 * Client entry — dev + hydration after SSG.
 */
import { createBloxApp } from '@bagelink/blox'
import { BagelVue, RouterWrapper } from '@bagelink/vue'

import '@bagelink/vue/styles/core.css'
import '@bagelink/blox/style.css'
import '@/styles/main.css'

import App from './App.vue'
import router from './router'

const blocks = import.meta.glob('./components/blocks/*.vue', { eager: true })

const websiteName = import.meta.env.VITE_BLOX_WEBSITE_NAME ?? 'my-site'

createBloxApp({
	rootComponent: App,
	router,
	modules: blocks as Record<string, any>,
	websiteName,
	store: websiteName,
	// This site is prerendered to static HTML, so navigation must be full
	// document loads: a click opens the already-built page. The default 'spa'
	// mode would route on the client and call /blox/websites/<id>/resolve-path
	// for pages it has no payload for — which fails on a static host (no API on
	// the site's origin, and the endpoint requires auth).
	navigation: 'document',
	apiBaseURL: import.meta.env.VITE_BLOX_API_URL ?? '/api',
	plugins: [[BagelVue, {}]],
	globalComponents: { RouterWrapper },
})

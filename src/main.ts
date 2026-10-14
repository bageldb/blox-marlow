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

// Navigation mode defaults to 'document' in @bagelink/blox: this site is
// prerendered one static file per route, so the browser navigates and clicks
// never hit the API. Only a site with an API on its own origin would want 'spa'.
createBloxApp({
	rootComponent: App,
	router,
	modules: blocks as Record<string, any>,
	websiteName,
	store: websiteName,
	apiBaseURL: import.meta.env.VITE_BLOX_API_URL ?? '/api',
	plugins: [[BagelVue, {}]],
	globalComponents: { RouterWrapper },
})

import { createRouter as _createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

export function createRouter(mode: 'web' | 'memory' = 'web', initialUrl?: string) {
	const history = mode === 'memory'
		? createMemoryHistory(initialUrl ?? '/')
		: createWebHistory(import.meta.env.BASE_URL)

	const router = _createRouter({
		history,
		routes: [
			// All pages are CMS-driven via CmsPageView (catch-all).
			// Add explicit routes here only if you need non-CMS pages.
		],
		scrollBehavior(to) {
			if (to.hash) return { behavior: 'smooth', el: to.hash }
			return { top: 0 }
		},
	})

	router.onError((error, to) => {
		if (typeof window !== 'undefined' && error.message.includes('Failed to fetch dynamically imported module')) {
			Object.assign(window, { location: to.fullPath })
		}
	})

	return router
}

export default createRouter()

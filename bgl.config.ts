import { defineWorkspace } from '@bagelink/workspace'

export default defineWorkspace({
	localhost:   { host: 'http://localhost:8000', proxy: '/api' },
	// `proxy` is required for the dev server to reach the API: the renderer calls
	// `/api/*`, and without a proxy those requests hit Vite itself (404). With it,
	// dev is same-origin (no CORS) against the deployed backend.
	development: { host: 'https://dev-auctentic.bagel.to', proxy: '/api' },
	production:  { host: 'https://dev-auctentic.bagel.to' },
})

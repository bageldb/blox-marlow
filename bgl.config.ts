import { defineWorkspace } from '@bagelink/workspace'

export default defineWorkspace({
	localhost:   { host: 'http://localhost:8000', proxy: '/api' },
	development: { host: 'https://dev-auctentic.bagel.to' },
	production:  { host: 'https://dev-auctentic.bagel.to' },
})

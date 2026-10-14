import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { bloxPlugin } from '@bagelink/blox/vite'
import { bagelink } from '@bagelink/workspace/vite'
import workspace from './bgl.config'

export default defineConfig(({ isSsrBuild }) => ({
	plugins: [
		...bloxPlugin({ ssr: true, emitManifest: true }),
		vue(),
		bagelink({ workspace }),
	],
	// Render the Bagel packages from source in the SSR bundle, as every Blox
	// site does — externalising them breaks resolution at prerender time.
	ssr: {
		noExternal: ['@bagelink/blox', '@bagelink/vue', 'vue', 'vue-router', 'pinia'],
	},
	build: {
		// The prerender pass emits the bundle blox-ssg imports at build time. It
		// goes in its own directory so the client build's dist/index.html — the
		// shell every prerendered route is rendered from — is left intact.
		...(isSsrBuild
			? {
				ssr: true,
				rollupOptions: { input: 'src/main.server.ts' },
				outDir: 'dist/server',
			}
			: {}),
	},
}))

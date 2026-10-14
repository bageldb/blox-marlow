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
	build: {
		// The SSR pass runs after the client build and shares the same outDir.
		// Vite empties outDir by default, which would delete the client's
		// index.html (the shell `blox-ssg` renders every prerendered route from).
		// Keep both outputs side by side.
		...(isSsrBuild ? { ssr: true, emptyOutDir: false } : {}),
	},
}))

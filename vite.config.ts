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
		// The SSR pass writes the prerender bundle blox-ssg imports at build
		// time. It must live in its own subdirectory: writing it into dist/ root
		// makes Vite empty dist/ (deleting the client's index.html, which
		// blox-ssg renders every route from), and blox-ssg then fails with
		// "Cannot find module dist/server/main.server.js".
		...(isSsrBuild ? { ssr: true, outDir: 'dist/server' } : {}),
	},
}))

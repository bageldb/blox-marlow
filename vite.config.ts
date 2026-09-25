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
		...(isSsrBuild ? { ssr: true } : {}),
	},
}))

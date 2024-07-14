import { sveltekit } from '@sveltejs/kit/vite';
import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			$components: path.resolve('./src/lib/components'),
			$data: path.resolve('./src/lib/stores/data'),
			$types: path.resolve('./src/lib/types'),
			$api: path.resolve('./src/lib/api'),
			$utils: path.resolve('./src/lib/utils.ts'),
			$assets: path.resolve('./src/lib/assets')
		}
	},
	plugins: [
		sveltekit(),
		tsconfigPaths({
			root: './' // Adjust if your tsconfig is in a different location
		})
	],
	server: {
		port: 5173,
		proxy: {
			'/api': 'http://localhost:3000' // Proxy to backend
		}
	}
});

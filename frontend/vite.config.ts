import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib')
    }
  },
  plugins: [
    sveltekit(),
    tsconfigPaths({
      root: './', // Adjust if your tsconfig is in a different location
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000", // Proxy to backend
    },
  },
});

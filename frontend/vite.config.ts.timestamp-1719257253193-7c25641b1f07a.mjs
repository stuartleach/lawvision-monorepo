// vite.config.ts
import { sveltekit } from "file:///Users/stuartleach/Coding/lawvision/lawvision-monorepo/node_modules/.pnpm/@sveltejs+kit@2.5.17_@sveltejs+vite-plugin-svelte@3.1.1_svelte@4.2.18_vite@5.3.1_@types+node@_vc3tvteyxus4zf7niotyi4ouge/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { defineConfig } from "file:///Users/stuartleach/Coding/lawvision/lawvision-monorepo/node_modules/.pnpm/vitest@1.6.0_@types+node@20.14.7/node_modules/vitest/dist/config.js";
import tsconfigPaths from "file:///Users/stuartleach/Coding/lawvision/lawvision-monorepo/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.5.2_vite@5.3.1_@types+node@20.14.7_/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    sveltekit(),
    tsconfigPaths({
      root: "./"
      // Adjust if your tsconfig is in a different location
    })
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3456"
      // Proxy to backend
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3R1YXJ0bGVhY2gvQ29kaW5nL2xhd3Zpc2lvbi9sYXd2aXNpb24tbW9ub3JlcG8vZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdHVhcnRsZWFjaC9Db2RpbmcvbGF3dmlzaW9uL2xhd3Zpc2lvbi1tb25vcmVwby9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3R1YXJ0bGVhY2gvQ29kaW5nL2xhd3Zpc2lvbi9sYXd2aXNpb24tbW9ub3JlcG8vZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHN2ZWx0ZWtpdCgpLFxuICAgIHRzY29uZmlnUGF0aHMoe1xuICAgICAgcm9vdDogJy4vJywgLy8gQWRqdXN0IGlmIHlvdXIgdHNjb25maWcgaXMgaW4gYSBkaWZmZXJlbnQgbG9jYXRpb25cbiAgICB9KSxcbiAgXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBwcm94eToge1xuICAgICAgXCIvYXBpXCI6IFwiaHR0cDovL2xvY2FsaG9zdDozNDU2XCIsIC8vIFByb3h5IHRvIGJhY2tlbmRcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStXLFNBQVMsaUJBQWlCO0FBQ3pZLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLGNBQWM7QUFBQSxNQUNaLE1BQU07QUFBQTtBQUFBLElBQ1IsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

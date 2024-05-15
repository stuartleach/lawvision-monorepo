import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from 'vite-tsconfig-paths';


export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      root: '../../', // Adjust if your tsconfig is in a different location
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000", // Proxy to backend
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use environment variable to determine base path
  // For Vercel, we want the base to be '/' instead of '/flora-fight-frenzy/'
  base: process.env.DEPLOY_TARGET === 'vercel' ? '/' : 
        mode === 'production' ? '/flora-fight-frenzy/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    svgr(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
}));
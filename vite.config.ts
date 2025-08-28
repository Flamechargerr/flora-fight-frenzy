import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Always use relative paths
  base: "./",
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
    chunkSizeWarningLimit: 1000,
    assetsDir: 'assets',
    // Ensure CSS is extracted properly
    cssCodeSplit: true,
    // Simplify output for compatibility with Vercel
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Ensure asset filenames are simple and predictable
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
}));
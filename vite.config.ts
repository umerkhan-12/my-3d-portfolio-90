import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // /api is a Vercel function; point this at a local copy when developing it.
    proxy: process.env.API_PROXY ? { "/api": process.env.API_PROXY } : undefined,
  },
  preview: {
    proxy: process.env.API_PROXY ? { "/api": process.env.API_PROXY } : undefined,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split the heavy, rarely-changing dependencies so the app chunk stays
        // small and three.js can be fetched after first paint.
        manualChunks: {
          react: ["react", "react/jsx-runtime", "react-dom", "react-router-dom"],
          three: ["three", "@react-three/fiber"],
          motion: ["framer-motion"],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
}));

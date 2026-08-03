import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    // Le badge flottant Vue DevTools ne doit jamais apparaître en production —
    // ni sur un preview Vercel : il donne une impression de site non fini.
    mode === 'development' && vueDevTools(),
    tailwindcss(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Contrainte spec 16.1 : poids de page < 400 Ko
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        // Vite 8 / Rolldown : manualChunks doit etre une fonction, pas un objet.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
}))

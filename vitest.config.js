import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfigFn from './vite.config.js'

// vite.config.js exporte une fonction (mode) => config, pour désactiver
// Vue DevTools hors développement. mergeConfig n'accepte pas de callback :
// on la résout ici avec le mode 'test'.
const viteConfig = viteConfigFn({ mode: 'test', command: 'serve' })

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      include: ['tests/**/*.spec.js', 'src/**/*.spec.js'],
    },
  }),
)

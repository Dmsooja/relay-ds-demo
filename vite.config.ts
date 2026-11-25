import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'library') {
    return {
      build: {
        outDir: 'dist',
        lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index', cssFileName: 'style' },
        rollupOptions: { external: ['react', 'react/jsx-runtime', 'react-dom'] },
      },
    }
  }
  const implementation = mode === 'web-components' || mode === 'react-web-components'
    ? `frameworks/${mode}/app.ts`
    : 'src/react-app.ts'
  return {
    publicDir: 'shared/public',
    resolve: { alias: { '#site-implementation': resolve(import.meta.dirname, implementation) } },
    build: { outDir: `dist-${mode === 'production' ? 'react' : mode}` },
  }
})

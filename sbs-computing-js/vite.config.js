import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: './examples',
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './lib'),
      '@core': resolve(__dirname, './lib/core'),
      '@debug': resolve(__dirname, './lib/debug')
    }
  },
  server: {
    port: 3000,
    open: '/debug.html'
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'examples/debug.html')
      }
    }
  }
})

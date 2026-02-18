import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/hydronag/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
})
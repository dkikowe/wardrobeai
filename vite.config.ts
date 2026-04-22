import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/n2b-images': {
        target: 'https://n2b.su',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n2b-images/, '')
      }
    }
  }
})

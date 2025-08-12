import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || '3002'),
    host: '0.0.0.0',
    open: false,
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'components': fileURLToPath(new URL('./components', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ['@radix-ui/react-tooltip']
  }
})

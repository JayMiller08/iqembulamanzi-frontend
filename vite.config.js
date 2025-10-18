import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000,
    proxy: {
      '/login': {
        target: 'http://localhost:2000',
        changeOrigin: true,
        secure: false,
      },
      '/submit': {
        target: 'http://localhost:2000',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://localhost:2000',
        changeOrigin: true,
        secure: false,
      },
      '/whatsapp': {
        target: 'http://localhost:2000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:2000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

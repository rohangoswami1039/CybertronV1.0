// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  define: {
    global: 'window',
  },
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    allowedHosts: 'all', // allow all custom domains like *.ngrok-free.app
    cors: true
  },
})

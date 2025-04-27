import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make sure environment variables are properly replaced at build time
    'import.meta.env.VITE_BASE_URL': JSON.stringify(process.env.VITE_BASE_URL || 'https://blog-backend-hpl0.onrender.com')
  },
  build: {
    // Generate sourcemaps for easier debugging
    sourcemap: true,
  }
})

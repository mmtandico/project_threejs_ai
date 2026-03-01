import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow importing .fbx files as static assets so they can be used with FBXLoader
  assetsInclude: ['**/*.fbx'],
  // Server configuration for development (not used in production builds)
  server: {
    host: true, // Allow external connections
    allowedHosts: [
      'localhost',
      '.netlify.app', // Allow all Netlify preview domains
    ],
  },
  // Build configuration for production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow importing .fbx files as static assets so they can be used with FBXLoader
  assetsInclude: ['**/*.fbx'],
})

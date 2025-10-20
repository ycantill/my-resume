import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Set base path for GitHub Pages deployment
  // Update this to match your repository name if different
  base: mode === 'production' ? '/my-resume/' : '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Generate manifest for better caching
    manifest: true,
    // Ensure assets are properly handled
    assetsDir: 'assets'
  }
}))
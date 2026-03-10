import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Default to repo path for GitHub Pages project sites.
  // Set VITE_BASE_PATH=/ when using a custom root domain.
  const base = env.VITE_BASE_PATH || '/Test-Analytics-Neon/'

  return {
    base,
    plugins: [react()],
    publicDir: 'public', // Ensure public folder files (like 404.html) are copied to dist
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      }
    }
  }
})

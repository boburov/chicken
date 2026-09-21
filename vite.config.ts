import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // The lazily-loaded 3D chunk (three + r3f + drei) is ~1 MB by nature.
    chunkSizeWarningLimit: 1200,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative asset URLs so the built app works from GitHub Pages subfolders.
export default defineConfig({
  base: './',
  plugins: [react()],
})

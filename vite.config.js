import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Required for folder aliasing

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      // This maps the word "pages" directly to your src/pages folder
      "pages": path.resolve(__dirname, "./src/pages"),
      // Optional: adds "@" as a shortcut for the src folder
      "@": path.resolve(__dirname, "./src"),
    },
  },
})



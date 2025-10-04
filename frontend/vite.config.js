import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      parserOpts: {
        plugins: ['jsx', 'typescript']
      }
    }
  })],
  esbuild: {
    target: 'es2015',
    charset: 'utf8'
  }
})

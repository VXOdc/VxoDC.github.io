import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // If your URL is https://vxodc.github.io/, use '/'
  // If your URL is https://vxodc.github.io/project-name/, use '/project-name/'
  base: '/', 
})

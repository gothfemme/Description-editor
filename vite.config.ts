import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   base: './',
   resolve: {
      alias: {
         src: '/src'
      }
   },
   build: {
      target: 'esnext',
      minify: false,
      sourcemap: true,
   }
})
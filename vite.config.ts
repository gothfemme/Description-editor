import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
         '@assets': path.resolve(__dirname, './src/assets'),
         '@components': path.resolve(__dirname, './src/components'),
         '@data': path.resolve(__dirname, './src/data'),
         '@utils': path.resolve(__dirname, './src/utils'),
         '@redux': path.resolve(__dirname, './src/redux'),
         '@descriptionConverter': path.resolve(__dirname, './src/descriptionConverter'),
         '@descriptionUpload': path.resolve(__dirname, './src/descriptionUpload'),

         // remove ones bellow
         '@ts': path.resolve(__dirname, './src/ts')
      }
   },
   base: './',
   build: {
      target: 'esnext'
   }
})

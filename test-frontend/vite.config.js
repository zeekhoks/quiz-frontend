import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  devServer: {
    proxy: 'http://127.0.0.1:8000/api/login',
  }
})

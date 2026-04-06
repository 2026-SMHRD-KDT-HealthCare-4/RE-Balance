import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 브라우저에서 /api로 시작하는 요청을 보내면 http://localhost:8080으로 전달합니다.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  optimizeDeps: {
    include: ['@mediapipe/pose', '@mediapipe/camera_utils'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})
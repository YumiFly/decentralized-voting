import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // 自定义路径别名
    },
  },
  server: {
    port: 3000, // 自定义端口
    open: true, // 自动打开浏览器
  },
  build: {
    outDir: 'dist', // 确保与 tsconfig.node.json 的 outDir 一致（可选）
  },
})

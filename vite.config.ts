import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/_variables.scss" as *;`
      }
    }
  },
  build: {
    // 生产环境优化
    minify: 'esbuild',
    // 分包策略
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'axios': ['axios']
        }
      }
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 生成 sourcemap
    sourcemap: false,
    // 设置 chunk 大小警告阈值
    chunkSizeWarningLimit: 500
  },
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://www.blog.test',
        changeOrigin: true
      }
    }
  }
})

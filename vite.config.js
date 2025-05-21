import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    host: "0.0.0.0",
    port: "3000",
    hmr: {
      protocol: 'ws',
      clientPort: 3000
    }
  },
  preview: {
    allowedHosts: [
      // ... 其他已允许的主机 ...
      'poste-creator-devbox-release-svc.tasmj.com',
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

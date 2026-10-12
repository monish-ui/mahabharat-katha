import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Mahabharat Katha & Gita',
        short_name: 'Mahabharat',
        description: 'महाभारत की कथाएँ और श्रीमद्भगवद्गीता — हिंदी और English में, पूरी तरह offline',
        theme_color: '#7a1f1f',
        background_color: '#fff8ec',
        display: 'standalone',
        lang: 'hi',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,png,svg,json,woff2}'], navigateFallbackDenylist: [/^\/privacy/] }
    })
  ],
  build: { target: 'es2019' },
  server: { host: '127.0.0.1', port: 5173 }
})

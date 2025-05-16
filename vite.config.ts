// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      injectRegister: 'auto',
      injectManifest: {
        injectionPoint: undefined,
        rollupFormat: 'iife',
      },
      devOptions: {
        enabled: true, // Enable PWA in development
        navigateFallback: 'index.html',
      },
      includeAssets: [
        'favicon.ico', 
        'favicon.svg', 
        'robots.txt',
        'icons/apple-touch-icon.png',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png'
      ],
      manifest: {
        name: 'Amazon Affiliate Link Converter',
        short_name: 'Affiliate Links',
        description: 'Convert Amazon links to affiliate links with ease',
        theme_color: '#1976d2',
        start_url: '/affiliate-link/',
        display: 'standalone',
        scope: '/affiliate-link/',
        icons: [
          {
            src: '/affiliate-link/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/affiliate-link/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/affiliate-link/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: '/affiliate-link/', // Updated base path for GitHub Pages
  server: {
    host: '127.0.0.1',  // Use IP instead of localhost
    port: 3000,
    strictPort: true,   // Fail if port is already in use
    open: true,
    https: false,       // Disable HTTPS for development
    cors: true,         // Enable CORS
    watch: {
      usePolling: true  // Use polling for file changes
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps in production for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@mui/material']
        }
      }
    },
    target: 'es2015', // Ensure compatibility with most browsers
    minify: 'terser', // Better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  }
});

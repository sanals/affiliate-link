// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// Custom plugin to copy files that are critical for the PWA
const ensurePwaAssets = () => {
  return {
    name: 'ensure-pwa-assets',
    closeBundle: () => {
      const distDir = path.resolve(__dirname, 'dist');
      
      // Ensure icons directory exists
      const publicIconsDir = path.resolve(__dirname, 'public/icons');
      const distIconsDir = path.resolve(distDir, 'icons');
      
      if (!fs.existsSync(distIconsDir)) {
        fs.mkdirSync(distIconsDir, { recursive: true });
        console.log('Created icons directory in dist/');
      }
      
      // Copy all icon files
      if (fs.existsSync(publicIconsDir)) {
        const iconFiles = fs.readdirSync(publicIconsDir);
        iconFiles.forEach(file => {
          const srcPath = path.join(publicIconsDir, file);
          const destPath = path.join(distIconsDir, file);
          
          if (fs.statSync(srcPath).isFile()) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied icon: ${file}`);
          }
        });
      }
      
      // Create .nojekyll file
      fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
      console.log('Created .nojekyll file');
      
      // Create or copy CNAME file
      const cnameSrc = path.resolve(__dirname, 'CNAME');
      const cnameDest = path.join(distDir, 'CNAME');
      
      if (fs.existsSync(cnameSrc)) {
        fs.copyFileSync(cnameSrc, cnameDest);
        console.log('Copied CNAME file');
      } else {
        fs.writeFileSync(cnameDest, 'syrez.co.in');
        console.log('Created CNAME file with syrez.co.in');
      }

      // Create _headers file for Netlify/CDN to set correct MIME types
      const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://amazon.in https://amzn.in https://amzn.to;
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/*.js
  Content-Type: application/javascript

/*.mjs
  Content-Type: application/javascript

/*.css
  Content-Type: text/css

/*.png
  Content-Type: image/png

/*.ico
  Content-Type: image/x-icon

/*.svg
  Content-Type: image/svg+xml

/manifest.json
  Content-Type: application/json

/manifest.webmanifest
  Content-Type: application/manifest+json
`;
      fs.writeFileSync(path.join(distDir, '_headers'), headersContent);
      console.log('Created _headers file for MIME types and security headers');
    }
  };
};

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
        'icons/icon-512x512.png',
        'icons/icon-1024x1024.png',
        '404.html',
        'CNAME',
        '_headers'
      ],
      manifest: {
        name: 'Amazon Affiliate Link Converter',
        short_name: 'Affiliate Links',
        description: 'Convert Amazon links to affiliate links with ease',
        theme_color: '#1976d2',
        start_url: '/',
        display: 'standalone',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
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
    }),
    ensurePwaAssets() // Add our custom plugin to ensure assets are copied
  ],
  base: '/', // For custom domain deployment
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
    sourcemap: true, // Enable source maps for debugging
    assetsInlineLimit: 4096, // Files smaller than this will be inlined as base64
    emptyOutDir: true, // Empty the output directory before building
    copyPublicDir: true, // Copy all files from public/ to outDir/
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        diagnostics: resolve(__dirname, 'public/check-domain.js')
      },
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
        drop_console: false, // Keep console logs for troubleshooting
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

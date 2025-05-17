// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register service worker only in production AND when not in an iframe
// This prevents ServiceWorker conflicts
const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const isNotIframe = window.self === window.top;

if (isProd && isNotIframe && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Unregister any existing service workers first
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('Old ServiceWorker unregistered');
      }
      
      // Allow time for unregistration to complete
      setTimeout(async () => {
        try {
          // Determine the correct path for the service worker
          // For custom domain, use '/sw.js'
          // For GitHub Pages with repo name in the path, use '/repo-name/sw.js'
          let swPath = '/sw.js';
          
          // Check if we're on GitHub Pages and not a custom domain
          if (window.location.hostname.includes('github.io')) {
            // Extract the repository name from the path
            const pathSegments = window.location.pathname.split('/');
            if (pathSegments.length > 1 && pathSegments[1]) {
              swPath = `/${pathSegments[1]}${swPath}`;
            }
          }
          
          // Use the full origin plus the determined path
          const swUrl = `${window.location.origin}${swPath}`;
          console.log('Registering ServiceWorker from:', swUrl);
          
          const registration = await navigator.serviceWorker.register(swUrl, {
            scope: window.location.pathname.endsWith('/') 
              ? window.location.pathname 
              : window.location.pathname + '/'
          });
          
          console.log('ServiceWorker registration successful with scope:', registration.scope);
        } catch (error) {
          console.error('ServiceWorker registration failed:', error);
          console.error('Error details:', error instanceof Error ? error.message : String(error));
        }
      }, 1000);
    } catch (error) {
      console.error('ServiceWorker unregistration/registration failed:', error);
    }
  });
} else if ('serviceWorker' in navigator) {
  // In development mode, unregister any service workers to prevent conflicts
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
      console.log('ServiceWorker unregistered during development/iframe');
    }
  }).catch(error => {
    console.error('Error unregistering service worker:', error);
  });
}

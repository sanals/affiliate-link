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

// Only register the service worker in production mode
// This prevents ServiceWorker conflicts with Vite HMR during development
const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

if (isProd && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Unregister any existing service workers first to avoid conflicts
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
      
      // Register the service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      
      // Handle service worker updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // At this point, the updated precached content has been fetched,
                // but the previous service worker will still serve the older content
                console.log('New content is available; please refresh.');
              } else {
                // At this point, everything has been precached.
                console.log('Content is cached for offline use.');
              }
            }
          };
        }
      };
    } catch (error) {
      console.error('ServiceWorker registration failed: ', error);
    }
  });
} else if ('serviceWorker' in navigator) {
  // In development mode, unregister any service workers to prevent conflicts
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
      console.log('ServiceWorker unregistered during development');
    }
  });
}

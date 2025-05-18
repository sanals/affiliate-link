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

// Register the service worker in all environments
// This is needed for Web Share Target API to work
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
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
      
      // Setup listener for Web Share Target API messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SHARE_TARGET') {
          // Handle shared content here
          console.log('Received shared content:', event.data);
          
          // Store the shared URL in localStorage for the app to use
          if (event.data.url) {
            localStorage.setItem('sharedUrl', event.data.url);
          } else if (event.data.text) {
            localStorage.setItem('sharedText', event.data.text);
          }
          
          // Reload the page to process the shared content
          window.location.reload();
        }
      });
    } catch (error) {
      console.error('ServiceWorker registration failed: ', error);
    }
  });
}

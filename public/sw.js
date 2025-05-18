// public/sw.js

const CACHE_NAME = 'amazon-affiliate-converter-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
    .then(() => self.clients.claim()) // Take control of all clients
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  // Don't interfere with share-target requests
  if (event.request.url.includes('share-target')) {
    return;
  }
  
  // Standard cache-first strategy for other resources
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }
        
        // Clone the request and fetch from network
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Don't cache non-successful responses or non-GET requests
            if (!response || response.status !== 200 || event.request.method !== 'GET') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Cache the fetched resource
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
  );
});

// Web Share Target handling
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Check if this is a share target request
  if (url.searchParams.has('share-target') || 
      url.pathname.includes('share-target') || 
      url.searchParams.has('text') || 
      url.searchParams.has('url')) {
    
    // Extract the shared data
    const title = url.searchParams.get('title') || '';
    const text = url.searchParams.get('text') || '';
    const sharedUrl = url.searchParams.get('url') || '';
    
    // Open the app in a new window or focus an existing one
    event.respondWith((async () => {
      // Try to find an existing window
      const clientList = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });
      
      // If we have an existing window, focus it and post a message
      if (clientList.length > 0) {
        const client = clientList[0];
        await client.focus();
        client.postMessage({
          type: 'SHARE_TARGET',
          title,
          text,
          url: sharedUrl
        });
        
        return Response.redirect('/?share-success=true');
      } 
      // Otherwise, open a new window
      else {
        const client = await self.clients.openWindow('/?share-target=true');
        
        // Wait a bit for the window to load before sending the message
        if (client) {
          setTimeout(() => {
            client.postMessage({
              type: 'SHARE_TARGET',
              title,
              text,
              url: sharedUrl
            });
          }, 1000);
        }
        
        return Response.redirect('/?share-success=true');
      }
    })());
  }
});

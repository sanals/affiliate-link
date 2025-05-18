// public/sw.js

const CACHE_NAME = 'amazon-affiliate-converter-v1';
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

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Helper function to check if URL is valid for caching
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    // Only cache same-origin and specific cross-origin requests (e.g. fonts)
    const validSchemes = ['http', 'https'];
    const validHosts = [self.location.hostname, 'fonts.googleapis.com', 'fonts.gstatic.com'];
    
    return (
      validSchemes.includes(urlObj.protocol.replace(':', '')) &&
      (validHosts.includes(urlObj.hostname) || urlObj.hostname === 'localhost')
    );
  } catch (e) {
    return false;
  }
};

// Cache and return requests
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip invalid URLs (chrome extensions, etc.)
  if (!isValidUrl(event.request.url)) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Skip caching if URL isn't valid
            if (!isValidUrl(event.request.url)) {
              return response;
            }
            
            try {
              // Clone the response as it's a stream and can only be consumed once
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache)
                    .catch(err => console.log('Cache put error:', err));
                })
                .catch(err => console.log('Cache open error:', err));
                
              return response;
            } catch (error) {
              console.error('Service worker cache error:', error);
              return response;
            }
          }
        ).catch(error => {
          console.log('Fetch failed:', error);
          // You might want to return a fallback response here
        });
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

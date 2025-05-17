// Script to help diagnose domain issues
(function() {
  const report = {
    url: window.location.href,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    userAgent: navigator.userAgent,
    supportsFetch: 'fetch' in window,
    supportsServiceWorker: 'serviceWorker' in navigator,
    serviceWorkerRegistration: null,
    resources: {
      loaded: [],
      failed: []
    }
  };

  // Check service worker registration
  if (report.supportsServiceWorker) {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        report.serviceWorkerRegistration = registrations.map(reg => ({
          scope: reg.scope,
          state: reg.active ? 'active' : reg.installing ? 'installing' : reg.waiting ? 'waiting' : 'unknown'
        }));
        updateConsoleOutput();
      })
      .catch(error => {
        report.serviceWorkerError = error.message;
        updateConsoleOutput();
      });
  }

  // Check resource loading
  const resourcesToCheck = [
    '/favicon.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/manifest.json',
    '/sw.js'
  ];

  Promise.all(resourcesToCheck.map(resource => {
    return fetch(resource)
      .then(response => {
        if (response.ok) {
          report.resources.loaded.push(resource);
        } else {
          report.resources.failed.push({
            resource,
            status: response.status,
            statusText: response.statusText
          });
        }
        return response;
      })
      .catch(error => {
        report.resources.failed.push({
          resource,
          error: error.message
        });
      });
  }))
  .finally(() => {
    updateConsoleOutput();
  });

  function updateConsoleOutput() {
    console.clear();
    console.log('%c 🔍 Domain Diagnostics', 'font-size: 16px; font-weight: bold; color: #1976d2;');
    console.log(report);
    
    if (report.resources.failed.length > 0) {
      console.log('%c ❌ Failed Resources:', 'font-size: 14px; font-weight: bold; color: #d32f2f;');
      console.table(report.resources.failed);
    } else {
      console.log('%c ✅ All resources loaded successfully!', 'font-size: 14px; font-weight: bold; color: #388e3c;');
    }
  }

  // Create a button to show diagnostics
  const button = document.createElement('button');
  button.textContent = '🔍 Check Domain';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '9999';
  button.style.padding = '8px 12px';
  button.style.backgroundColor = '#1976d2';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  
  button.addEventListener('click', () => {
    updateConsoleOutput();
    alert('Domain diagnostics have been logged to the console (F12). Please share this information if you need help troubleshooting.');
  });
  
  window.addEventListener('load', () => {
    document.body.appendChild(button);
  });
})(); 
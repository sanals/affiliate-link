// This script helps debug deployment and domain issues
// It runs automatically when the app loads and outputs diagnostic information to the console

(function() {
  // Wait for DOM to be ready
  window.addEventListener('DOMContentLoaded', function() {
    console.group('📋 Deployment Diagnostics');
    
    // Basic environment info
    console.log('📍 Current URL:', window.location.href);
    console.log('📍 Hostname:', window.location.hostname);
    console.log('📍 Pathname:', window.location.pathname);
    console.log('📍 Protocol:', window.location.protocol);
    
    // Check if running on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    console.log('📍 GitHub Pages:', isGitHubPages ? 'Yes' : 'No');
    
    // If custom domain, show info
    if (!isGitHubPages) {
      console.log('📍 Running on custom domain: ', window.location.hostname);
    }
    
    // Check assets loading
    console.group('🔍 Asset Loading Check');
    
    // Test manifest.json
    fetch('/manifest.json')
      .then(response => {
        console.log('📍 manifest.json:', response.ok ? 'Loaded ✅' : 'Failed ❌', response.status);
        return response.ok ? response.json() : null;
      })
      .then(data => {
        if (data) {
          console.log('📍 manifest.json scope:', data.scope);
          console.log('📍 manifest.json start_url:', data.start_url);
        }
      })
      .catch(err => console.log('📍 manifest.json error:', err));
    
    // Test icon loading
    const iconTest = new Image();
    iconTest.onload = function() {
      console.log('📍 Icon test: Loaded ✅');
    };
    iconTest.onerror = function() {
      console.log('📍 Icon test: Failed ❌');
    };
    iconTest.src = '/icons/icon-192x192.png';
    
    // Test service worker support
    if ('serviceWorker' in navigator) {
      console.log('📍 ServiceWorker API: Supported ✅');
      navigator.serviceWorker.getRegistrations()
        .then(registrations => {
          console.log('📍 Active ServiceWorkers:', registrations.length);
          registrations.forEach((registration, index) => {
            console.log(`📍 SW #${index+1} scope:`, registration.scope);
          });
        })
        .catch(err => console.log('📍 ServiceWorker check error:', err));
    } else {
      console.log('📍 ServiceWorker API: Not supported ❌');
    }
    
    // Check if site is installable
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('📍 Display mode: Standalone (installed) ✅');
    } else {
      console.log('📍 Display mode: Browser ℹ️');
    }
    
    // Check if in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('📍 Environment: Development ℹ️');
    } else {
      console.log('📍 Environment: Production ℹ️');
    }
    
    console.groupEnd(); // Asset Loading Check
    
    // Calculate paths that would be used based on current URL
    console.group('🔧 Path Calculations');
    
    // For service worker path
    let calculatedSwPath = '/sw.js';
    if (isGitHubPages) {
      const pathSegments = window.location.pathname.split('/');
      if (pathSegments.length > 1 && pathSegments[1]) {
        calculatedSwPath = `/${pathSegments[1]}${calculatedSwPath}`;
      }
    }
    console.log('📍 Calculated SW path:', calculatedSwPath);
    console.log('📍 Full SW URL would be:', `${window.location.origin}${calculatedSwPath}`);
    
    // Calculate scope based on current URL
    const calculatedScope = window.location.pathname.endsWith('/') 
        ? window.location.pathname 
        : window.location.pathname + '/';
    console.log('📍 Calculated scope:', calculatedScope);
    
    console.groupEnd(); // Path Calculations
    
    console.groupEnd(); // Deployment Diagnostics
  });
})(); 
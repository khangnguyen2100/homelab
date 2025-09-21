// PWA Initialization for Glance Dashboard
// Optimized for HTTPS environments with service worker support
(function() {
  'use strict';

  // Add PWA meta tags to document head
  function addPWAMetaTags() {
    const head = document.head || document.getElementsByTagName('head')[0];
    
    // Skip if already added
    if (document.querySelector('link[rel="manifest"]')) {
      console.log('PWA meta tags already present');
      return;
    }
    
    // Add manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/assets/manifest.json';
    head.appendChild(manifestLink);
    
    // Add theme color
    const themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = '#317EFB';
    head.appendChild(themeColorMeta);
    
    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0';
      head.appendChild(viewportMeta);
    }
    
    // Add apple touch icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/assets/icon-192x192.png';
    head.appendChild(appleTouchIcon);
    
    console.log('✅ PWA meta tags added');
  }

  // Register service worker for offline functionality
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/assets/service-worker.js', {
          scope: '/'
        })
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 New service worker available');
                  // Auto-update without user prompt for seamless experience
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
      });
    } else {
      console.warn('⚠️ Service Workers not supported in this browser');
    }
  }

  // Handle PWA install prompt
  function handleInstallPrompt() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('📱 PWA install prompt available');
      e.preventDefault();
      deferredPrompt = e;
      
      // Create install button
      createInstallButton(deferredPrompt);
    });

    window.addEventListener('appinstalled', () => {
      console.log('🎉 PWA installed successfully');
      deferredPrompt = null;
    });
  }
  
  // Create install button
  function createInstallButton(deferredPrompt) {
    const installButton = document.createElement('button');
    installButton.innerHTML = '📱 Install Glance Dashboard';
    installButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background: linear-gradient(135deg, #317EFB, #4A90E2);
      color: white;
      border: none;
      padding: 12px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(49, 126, 251, 0.3);
      transition: all 0.2s ease;
      opacity: 0;
      transform: translateY(-20px);
    `;
    
    installButton.addEventListener('click', () => {
      installButton.remove();
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ PWA install accepted');
        } else {
          console.log('❌ PWA install declined');
        }
        deferredPrompt = null;
      });
    });
    
    document.body.appendChild(installButton);
    
    // Animate in
    setTimeout(() => {
      installButton.style.opacity = '1';
      installButton.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (installButton.parentNode) {
        installButton.style.opacity = '0';
        installButton.style.transform = 'translateY(-20px)';
        setTimeout(() => installButton.remove(), 300);
      }
    }, 8000);
  }

  // Initialize PWA
  function initPWA() {
    console.log('🚀 Initializing Glance Dashboard PWA...');
    addPWAMetaTags();
    registerServiceWorker();
    handleInstallPrompt();
    console.log('✅ PWA initialization complete');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWA);
  } else {
    initPWA();
  }
})();

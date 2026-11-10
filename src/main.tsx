import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Clear all stale CacheStorage so user always gets the latest compiled UI and assets
if (typeof window !== 'undefined' && 'caches' in window) {
  caches.keys().then((names) => {
    names.forEach((name) => caches.delete(name));
  }).catch(() => {});
}

// Register Service Worker for mobile install and offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      reg.update().catch(() => {});
    }).catch((err) => {
      console.log('SW registration note:', err);
    });
  });
}

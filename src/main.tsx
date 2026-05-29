import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Force clear browser Cache Storage and unregister legacy service workers to prevent stale PWA caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    let unregisteredAny = false;
    for(let registration of registrations) {
      registration.unregister();
      unregisteredAny = true;
    }
    if (unregisteredAny) {
      console.log('[PWA] Unregistered stale service workers. Clearing Cache and Reloading...');
      if (window.caches) {
        caches.keys().then(function(names) {
          for (let name of names) {
            caches.delete(name);
          }
        });
      }
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

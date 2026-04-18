const cacheName = 'finance-pro-v1';
const assets = ['./', './index.html', './manifest.json', './icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

// Lógica para Notificações Push
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'NOTIFICAR_VENCIMENTO') {
        const options = {
            body: `O lucro de ${event.data.valor} já está disponível para coleta!`,
            icon: './icon.png',
            badge: './icon.png',
            vibrate: [200, 100, 200],
            tag: 'vencimento-lucro',
            renotify: true
        };

        self.registration.showNotification('Finance PRO: Lucro Disponível! 🚀', options);
    }
});

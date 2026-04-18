const cacheName = 'finance-pro-v2';
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

// ESCUTA MENSAGENS PARA DISPARAR NOTIFICAÇÃO
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'NOTIFICAR_VENCIMENTO') {
        self.registration.showNotification('Finance PRO: Lucro Disponível! 🚀', {
            body: `O seu lucro de ${event.data.valor} já pode ser coletado!`,
            icon: './icon.png',
            vibrate: [200, 100, 200],
            tag: 'vencimento-lucro'
        });
    }
});

const CACHE_NAME = 'hapcom-quran-cache-v13';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html'
];

self.addEventListener('install', event => {
    // Memaksa SW baru untuk langsung aktif tanpa menunggu tab ditutup
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache v2');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', event => {
    // Menghapus cache versi lama agar user mendapatkan update terbaru!
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim(); // Langsung klaim kontrol halaman
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response; // Return dari cache jika ada
            }
            return fetch(event.request).then(
                function(response) {
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    if(event.request.url.includes('hpcomtik.com') || event.request.url.startsWith(self.location.origin)) {
                        var responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });
                    }
                    return response;
                }
            );
        })
    );
});

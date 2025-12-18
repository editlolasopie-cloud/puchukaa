// Service Worker for PWA and Notifications

const CACHE_NAME = 'prachi-birthday-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Poppins:wght@300;400;600&display=swap'
];

// Install event - cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Push notification event
self.addEventListener('push', event => {
    let data = {};
    
    if (event.data) {
        data = event.data.json();
    }
    
    const title = data.title || 'Birthday Countdown';
    const options = {
        body: data.body || 'Daily love message for Prachi',
        icon: data.icon || 'icons/icon-192.png',
        badge: data.badge || 'icons/icon-192.png',
        tag: data.tag || 'birthday-countdown',
        data: data.url || '/',
        actions: data.actions || [
            {
                action: 'open',
                title: 'Open Countdown'
            }
        ],
        vibrate: [200, 100, 200]
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open') {
        // Focus existing window or open new one
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(clientList => {
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
    
    // Send message to all clients
    event.waitUntil(
        clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    action: 'notificationClick',
                    notificationId: event.notification.tag
                });
            });
        })
    );
});
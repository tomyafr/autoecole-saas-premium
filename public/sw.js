self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/app-icon-192.png', // L'icone carrée PWA
            badge: '/app-icon-192.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2'
            },
            requireInteraction: true,
            actions: [
                { action: 'explore', title: 'Ouvrir l\'application' }
            ]
        };
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

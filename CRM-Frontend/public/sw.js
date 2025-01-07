// Listen for push events
self.addEventListener('push', event => {
    // Assuming the push event contains JSON data
    const data = event.data ? event.data.json() : { title: 'Default Title', body: 'Default body' };

    console.log('Push received:', data);

    // Show notification
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/path-to-icon.png', // Optional: Add an icon for the notification
        vibrate: [200, 100, 200], // Optional: Add vibration pattern
        tag: 'push-notification', // Optional: Tag to handle notification replacement
        actions: [ // Optional: Add actions to the notification
            {
                action: 'explore',
                title: 'Go to the site'
            }
        ]
    });
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked');
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/') // Opens the specified URL
    );
});

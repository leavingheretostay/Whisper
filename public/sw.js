self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'New Whisper 💌';
  const options = {
    body: data.body || 'You received a new anonymous message',
    icon: 'https://9crwhisper.vercel.app/favicon.png',
    badge: 'https://9crwhisper.vercel.app/favicon.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('https://9crwhisper.vercel.app/dashboard'));
});

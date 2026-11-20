// Service worker: wakes up when the Apps Script server pushes a slot alert and shows it.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (event) {
  var d = { t: 'Weekly Plan', b: 'A new slot has started.', u: '', g: '' };
  try { if (event.data) d = Object.assign(d, event.data.json()); } catch (e) { /* show the default text */ }
  event.waitUntil(self.registration.showNotification(d.t, {
    body: d.b,
    tag: d.g || 'weekly-plan-slot',   // slot alerts replace each other; plan-update alerts have their own tag
    renotify: true,
    data: { u: d.u }
  }));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = event.notification.data && event.notification.data.u;
  if (url) event.waitUntil(self.clients.openWindow(url));
});

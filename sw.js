/* Ookami Hana service worker. Keeps the app files so it opens like an app. Change VERSION when you upload a new index.html. */
var VERSION = 'ookami-hana-v24a';
var FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== VERSION && k.indexOf('ookami-hana-') === 0; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin) return; /* voice models and other sites are left alone */
  e.respondWith(caches.open(VERSION).then(function(c){
    return c.match(r, { ignoreSearch: true }).then(function(hit){
      var net = fetch(r).then(function(res){ if (res && res.ok) c.put(r, res.clone()); return res; }).catch(function(){ return hit; });
      return hit || net; /* opens from saved copy at once; fresh copy is saved for next time */
    });
  }));
});

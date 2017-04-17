const CACHE_NAME = 'A-TALK-TO-ME-V3';
const urlsToCache = [
  '/',
  '/style.css',
  '/app.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // should only intercept GET requests
  if (request.method !== 'GET' || request.url.includes('sockjs-node')) {
    return event.respondWith(fetch(request));
  }

  const cacheTheResponse = (res) => {
    // don't need to cache response if the request is failed
    if (!res || res.status !== 200) {
      return res;
    }

    const contentType = res.headers.get('content-type');
    if (contentType.indexOf('application/json') !== -1) {
      res.clone()
        .json()
        .then(data => self.clients.matchAll()
        .then(all =>
          all.map(client => client.postMessage(data)),
        ));
    }

    const clonedRes = res.clone();
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        cache.put(request, clonedRes);
      });
    return res;
  };

  return event.respondWith(
    caches.match(request)
      .then((cachedRes) => {
        const networkedRes = fetch(request)
          .then(cacheTheResponse)
          // TODO: return an offline page when there is no cache nor network
          .catch(() => new Response('', {
            status: 503,
            statusText: 'Service Unavailable',
          }));

        // will return cache if there is one, otherwise it will return the normal request result
        return cachedRes || networkedRes;
      }),
  );
});

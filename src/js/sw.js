const CACHE_NAME = 'A-TALK-TO-ME-V1';
const urlsToCache = [
  '/',
  '/lib/prism.css',
  '/lib/prism.js',
  '/css/style.css',
  '/js/speak.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // should only intercept GET requests
  if (request.method !== 'GET') {
    return event.respondWith(fetch(request));
  }

  const cacheTheResponse = (res) => {
    // don't need to cache response if the request is failed
    if (!res || res.status !== 200 || res.type !== 'basic') {
      return res;
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
      })
  );
});

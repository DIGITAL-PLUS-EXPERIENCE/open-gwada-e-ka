const NETWORK_TIMEOUT_MS = 500
const RUNTIME = 'gwada-e-ka-pwa-runtime'
const cacheName = "cacheGek";
const precachedResources = [
  "/", 
  "/assets/audio/bass.wav",
  "/assets/audio/medium.wav",
  "/assets/audio/zoban.wav",
  "/assets/audio/large_bright.wav",
  "/assets/audio/large_dark.wav",
  "/assets/audio/large_warm.wav",
  "/assets/audio/medium_bright.wav",
  "/assets/audio/medium_dark.wav",
  "/assets/audio/medium_warm.wav",  
  "/assets/audio/multitap_reverse_pan.wav",
  "/assets/audio/reverser.wav",
  "/assets/audio/small_bright.wav",
  "/assets/audio/xlarge_warm.wav",
  "/assets/backgrounds/background-1.jpg",
  "/assets/banners/banner.svg",
  "/assets/icons/16x16.svg",
  "/assets/icons/32x32.svg",
  "/assets/icons/48x48.svg",
  "/assets/icons/192x192.svg",
  "/assets/icons/256x256.svg",
  "/assets/icons/Digital+Experience.png",
  "/assets/icons/gek_settings_icone_48x48.svg",
  "/assets/icons/gek_settings_icone_192x192.svg",
  "/assets/js/jquery-3.2.1.js",
  "/assets/js/roundslider.min.js",
  "/assets/screenshots/screenshot-gek.png",
  "/assets/styles/gek.css",
  "/assets/styles/roundsliders.min.css",
  "/assets/styles/font-awesome-4.7.0/css/font-awesome.min.css",
  "/assets/styles/font-awesome-4.7.0/fonts/fontawesome-webfont.woff2",
  "/assets/fonts/FORTE.ttf"
];

async function precache() {
  try {
    const cache = await caches.open(cacheName);
    return cache.addAll(precachedResources);    
  } catch (error) {
    return Response.error();    
  }  
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open("cacheGek");
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return Response.error();
  }
}

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
        const cached = caches.match(event.request)
        const fetched = fetch(event.request, { cache: 'force-cache' })
        const fetchedCopy = fetched.then(resp => resp.clone())
    
        const delayCacheResponse = new Promise((resolve) => {
            setTimeout(resolve, NETWORK_TIMEOUT_MS, cached);
        })          
        
        event.respondWith(
          Promise.race([fetched.catch(_ => cached), delayCacheResponse])
              .then(resp => resp || fetched)
              .catch(_ => { Response.error() })
          )

        event.waitUntil(
        Promise.all([fetchedCopy, caches.open(cacheName)])
            .then(([response, cache]) => response.ok && cache.put(event.request, response))
            .catch(_ => { Response.error() })
        )
    // }
})


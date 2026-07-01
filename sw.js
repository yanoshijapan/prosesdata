const CACHE_NAME = 'kepulangan-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap',
  'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js'
];

// Install Service Worker dan simpan file statis ke Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Intercept request saat aplikasi dibuka
self.addEventListener('fetch', event => {
  // PENTING: Abaikan request ke Google Apps Script agar sinkronisasi data selalu Real-Time (tidak di-cache)
  if (event.request.url.includes('script.google.com') || event.request.url.includes('googleusercontent.com')) {
      return; 
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kembalikan dari cache jika ada, jika tidak lakukan request ke internet
        return response || fetch(event.request);
      })
  );
});

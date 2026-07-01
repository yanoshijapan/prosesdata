// Ubah nama ini (misal ke v3, v4) setiap kali Anda melakukan perubahan kode di index.html
const CACHE_NAME = 'kepulangan-app-v3'; 
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './MONITOR.png', // Pastikan nama gambar sesuai dengan yang Anda unggah
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap',
  'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js'
];

// 1. Proses Install: Simpan cache baru dan paksa aktif
self.addEventListener('install', event => {
  // Memaksa Service Worker baru untuk langsung menginstal tanpa menunggu tab ditutup
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 2. Proses Aktivasi: Hapus cache versi lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Jika nama cache tidak sama dengan CACHE_NAME yang baru, hapus!
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache PWA lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Memaksa SW baru langsung mengambil alih web
  );
});

// 3. Proses Fetch: Ambil dari cache, kecualikan request API Database
self.addEventListener('fetch', event => {
  if (event.request.url.includes('script.google.com') || event.request.url.includes('googleusercontent.com')) {
      return; 
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

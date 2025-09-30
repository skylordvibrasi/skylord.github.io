// Nama cache. Ubah versi (misalnya: v1, v2) setiap kali Anda mengubah file yang di-cache.
const CACHE_NAME = 'skylord-vibrasi-cache-v1'; 

// DAFTAR SEMUA FILE YANG PERLU DISIMPAN AGAR BISA BERJALAN OFFLINE
const urlsToCache = [
  './index.html', // <--- SUDAH DIGANTI DARI Internal.html
  './manifest.json',
  // Ganti dengan path ke file ikon Anda
  './icon-192.png', 
  './icon-512.png',
  // Ganti dengan path ke file audio eksternal Anda
  './Starter.wav' 
];

// --- FASE 1: INSTALASI (Caching Aset) ---
self.addEventListener('install', event => {
  // Tunggu hingga cache dibuka dan semua file ditambahkan.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching shell assets');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker Gagal menyimpan cache:', error);
      })
  );
});

// --- FASE 2: AKTIVASI (Membersihkan Cache Lama) ---
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  // Hapus cache lama yang tidak ada di daftar whitelist.
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Menghapus cache lama', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// --- FASE 3: FETCH (Menyajikan Aset dari Cache) ---
self.addEventListener('fetch', event => {
  // Hanya proses permintaan GET (biasanya untuk aset)
  if (event.request.method === 'GET') {
    // Coba ambil dari Cache terlebih dahulu
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Jika ada di cache, segera kembalikan
          if (response) {
            return response;
          }

          // Jika tidak ada di cache, ambil dari jaringan
          return fetch(event.request);
        }
      )
    );
  }
});

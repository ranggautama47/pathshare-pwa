import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import {
  registerRoute,
  setDefaultHandler,
  setCatchHandler,
} from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

// ==========================================
// 1. PRECACHING — Semua aset build (JS/CSS/HTML)
// ==========================================
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// ==========================================
// 2. STRATEGY: API Dicoding → Network First
//    Kalau offline, pakai cache
// ==========================================
registerRoute(
  ({ url }) =>
    url.hostname.includes("story-api.dicoding.dev") ||
    url.pathname.includes("/v1"),
  new NetworkFirst({
    cacheName: "api-cache-v1",
    networkTimeoutSeconds: 5, // ← kalau network > 5 detik, pakai cache
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200], // hanya cache response 200 OK
      }),
      new ExpirationPlugin({
        maxEntries: 50, // maksimal 50 API response di cache
        maxAgeSeconds: 60 * 60, // cache expired setelah 1 jam
      }),
    ],
  }),
);

// ==========================================
// 3. STRATEGY: Images → Cache First
//    Load dari cache, update di background
// ==========================================
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache-v1",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  }),
);

// ==========================================
// 4. STRATEGY: Font & CSS eksternal → Stale While Revalidate
// ==========================================
registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "script",
  new StaleWhileRevalidate({
    cacheName: "static-assets-v1",
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
);

// ==========================================
// 5. DEFAULT HANDLER — Offline fallback untuk semua request lain
//    Ini yang fix masalah offline!
//    Coba cache dulu → fallback ke network
// ==========================================
setDefaultHandler(
  new StaleWhileRevalidate({
    cacheName: "default-cache-v1",
  }),
);

// ==========================================
// 6. CATCH HANDLER — Kalau semua strategi gagal (benar-benar offline)
//    Kembalikan halaman dari precache
// ==========================================
setCatchHandler(async ({ event }) => {
  // Kalau request HTML gagal → kembalikan app shell dari precache
  if (event.request.destination === "document") {
    const cache = await caches.open("workbox-precache-v2");
    const cachedResponse = await cache.match("/index.html");
    if (cachedResponse) return cachedResponse;
  }

  // Untuk request lain yang gagal → return 503
  return new Response("Offline - Koneksi tidak tersedia", {
    status: 503,
    statusText: "Service Unavailable",
    headers: new Headers({ "Content-Type": "text/plain; charset=utf-8" }),
  });
});

// ==========================================
// 7. INSTALL EVENT — Cache app shell manual (tambahan keamanan)
// ==========================================
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  // Langsung aktif tanpa tunggu tab lama ditutup
  self.skipWaiting();
});

// ==========================================
// 8. ACTIVATE EVENT — Bersihkan cache lama
// ==========================================
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    Promise.all([
      // Ambil alih semua client (tab) yang terbuka
      clients.claim(),
      // Hapus cache lama yang sudah tidak dipakai
      caches.keys().then((cacheNames) => {
        const validCaches = [
          "api-cache-v1",
          "image-cache-v1",
          "static-assets-v1",
          "default-cache-v1",
        ];
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Hapus cache yang bukan milik workbox dan bukan yang valid
              const isWorkbox = name.startsWith("workbox-");
              const isValid = validCaches.includes(name);
              return !isWorkbox && !isValid;
            })
            .map((name) => {
              console.log("[SW] Menghapus cache lama:", name);
              return caches.delete(name);
            }),
        );
      }),
    ]),
  );
});

// ==========================================
// 9. FETCH EVENT — Manual cache fallback (backup dari Workbox)
// ==========================================
self.addEventListener("fetch", (event) => {
  // Skip request non-GET (POST, PUT, DELETE)
  if (event.request.method !== "GET") return;

  // Skip chrome-extension dan request internal browser
  if (!event.request.url.startsWith("http")) return;

  // Workbox sudah handle sebagian besar — ini hanya backup
  // untuk request yang lolos dari registerRoute di atas
});

// ==========================================
// 9b. MESSAGE EVENT — Terima perintah dari halaman (postMessage)
// Ini yang memungkinkan halaman meminta SW untuk kirim notifikasi
// ==========================================
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, icon, badge, tag, requireInteraction, data } = event.data.payload;
    event.waitUntil(
      self.registration.showNotification(title || "PathShare", {
        body: body || "Ada pembaruan baru!",
        icon: icon || "/icons/icon-192.png",
        badge: badge || "/icons/icon-192.png",
        vibrate: [200, 100, 200],
        tag: tag || "pathshare-" + Date.now(),
        requireInteraction: requireInteraction ?? true,
        data: data || { url: "/" },
        actions: [
          { action: "view", title: "📍 Lihat Laporan" },
          { action: "dismiss", title: "✕ Tutup" },
        ],
      })
    );
    console.log("[SW] Notifikasi ditampilkan via postMessage.");
  }
});

// ==========================================
// 10. PUSH NOTIFICATION
// ==========================================
self.addEventListener("push", (event) => {
  console.log("[SW] Push Received.");

  let payload;
  try {
    payload = event.data ? event.data.json() : null;
  } catch {
    payload = null;
  }

  const title = payload?.title || "PathShare";
  const options = {
    body: payload?.body || "Ada laporan baru di sekitarmu!",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    vibrate: [200, 100, 200],
    tag: "pathshare-push",
    renotify: true,
    data: { url: payload?.url || "/" },
    actions: [
      { action: "view", title: "Lihat" },
      { action: "dismiss", title: "Tutup" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ==========================================
// 11. NOTIFICATION CLICK
// ==========================================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Kalau sudah ada tab yang terbuka → focus tab itu
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Kalau belum ada → buka tab baru
        return clients.openWindow(urlToOpen);
      }),
  );
});

// ==========================================
// 12. BACKGROUND SYNC
// ==========================================
self.addEventListener("sync", (event) => {
  console.log("[SW] Sync event tag:", event.tag);

  if (event.tag === "sync-new-story") {
    console.log("[SW] Background Sync: Mengirim data story yang tertunda...");
    event.waitUntil(
      (async () => {
        try {
          // Di sini normalnya kamu ambil data dari IndexedDB dan kirim ke API
          // Contoh:
          // const pendingStories = await getPendingStoriesFromIDB()
          // for (const story of pendingStories) {
          //   await fetch('/api/stories', { method: 'POST', body: JSON.stringify(story) })
          //   await deletePendingStoryFromIDB(story.id)
          // }

          // Untuk sekarang: simulasi delay 1 detik
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("[SW] Background Sync selesai!");
        } catch (err) {
          console.error("[SW] Sync gagal:", err);
          throw err; // throw → browser akan coba sync lagi nanti
        }
      })(),
    );
  }
});

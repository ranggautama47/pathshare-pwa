// File: src/notifications/push.js
// ============================================================
// VAPID Public Key — ganti ini kalau sudah punya backend
// Untuk testing lokal, kita pakai mode "local notification only"
// ============================================================
const VAPID_PUBLIC_KEY = null; // ← isi dengan key dari backend kalau ada

// ============================================================
// 1. REQUEST PERMISSION
// ============================================================
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("[Push] Browser tidak mendukung notifikasi.");
    return "unsupported";
  }

  // Kalau sudah granted, langsung return
  if (Notification.permission === "granted") {
    console.log("[Push] Permission sudah granted sebelumnya.");
    return "granted";
  }

  // Kalau denied, tidak bisa minta lagi lewat JS — harus manual di browser
  if (Notification.permission === "denied") {
    console.warn(
      "[Push] Permission denied. User harus allow manual di browser.",
    );
    return "denied";
  }

  // Minta permission
  const result = await Notification.requestPermission();
  console.log("[Push] Permission result:", result);
  return result;
};

// ============================================================
// 2. SUBSCRIBE PUSH (dengan VAPID, fallback ke local jika tidak ada key)
// ============================================================
export const subscribePush = async () => {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("[Push] Push tidak didukung di browser ini.");
      return null;
    }

    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      console.warn("[Push] Permission tidak granted, subscribe dibatalkan.");
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    console.log("[Push] SW Ready untuk subscribe.");

    // Cek kalau sudah ada subscription sebelumnya
    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) {
      console.log("[Push] Subscription sudah ada:", existingSub.endpoint);
      return existingSub;
    }

    // Kalau tidak ada VAPID key, skip subscribe (tidak bisa push dari server)
    if (!VAPID_PUBLIC_KEY) {
      console.warn(
        "[Push] Tidak ada VAPID key. Mode: Local Notification Only.",
      );
      return null;
    }

    // Subscribe dengan VAPID key
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log("[Push] Subscribe berhasil:", subscription.endpoint);

    // TODO: Kirim subscription ke backend kamu di sini
    // await fetch('/api/push/subscribe', { method: 'POST', body: JSON.stringify(subscription) })

    return subscription;
  } catch (err) {
    console.error("[Push] Subscribe gagal:", err);
    return null;
  }
};

// ============================================================
// 3. UNSUBSCRIBE PUSH
// ============================================================
export const unsubscribePush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log("[Push] Tidak ada subscription aktif.");
      return true;
    }

    await subscription.unsubscribe();
    console.log("[Push] Unsubscribe berhasil.");
    return true;
  } catch (err) {
    console.error("[Push] Unsubscribe gagal:", err);
    return false;
  }
};

// ============================================================
// 4. KIRIM NOTIFIKASI LOKAL (tanpa backend)
// ============================================================
export const sendLocalNotification = async (
  title = "PathShare",
  body = "Ada pembaruan baru!",
) => {
  try {
    // 1. Pastikan permission sudah granted
    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      console.warn("[Push] Tidak bisa kirim, permission:", permission);
      return false;
    }

    const options = {
      body: body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "pathshare-" + Date.now(),
      requireInteraction: true,
      vibrate: [200, 100, 200] // Paksa getar agar lebih ngeh
    };

    // 2. METODE PALING AMPUH: Panggil showNotification langsung dari registration
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, options);
        console.log("[Push] Notifikasi berhasil dipaksa muncul via SW Registration!");
        return true;
      } catch (swErr) {
        console.warn("[Push] SW showNotification gagal:", swErr.message);
      }
    }

    // 3. FALLBACK DARURAT: Pakai API Notification lawas
    try {
      const notif = new Notification(title, options);
      console.log("[Push] Notifikasi muncul via API Notification standar.");
      return true;
    } catch (err) {
      console.error("[Push] Semua metode gagal:", err.message);
      return false;
    }

  } catch (err) {
    console.error("[Push] Error fatal:", err);
    return false;
  }
};
// ============================================================
// 5. CEK STATUS NOTIFIKASI
// ============================================================
export const getNotificationStatus = () => {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission; // 'default' | 'granted' | 'denied'
};

// ============================================================
// 6. BACKGROUND SYNC — register sync event
// ============================================================
export const registerBackgroundSync = async (tag = "sync-new-story") => {
  try {
    if (!("serviceWorker" in navigator) || !("SyncManager" in window)) {
      console.warn("[Sync] Background Sync tidak didukung di browser ini.");
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    console.log("[Sync] Background Sync terdaftar dengan tag:", tag);
    return true;
  } catch (err) {
    console.error("[Sync] Gagal register Background Sync:", err);
    return false;
  }
};

// ============================================================
// HELPER: Convert VAPID key dari base64 ke Uint8Array
// ============================================================
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ============================================================
// EXPORT SEMUA (backward compatible)
// ============================================================
// Alias lama supaya kode yang import ini tidak rusak
export const sendTestNotification = sendLocalNotification;

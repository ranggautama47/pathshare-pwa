// File: src/sync/backgroundSync.js

export const registerBackgroundSync = async (tag = 'sync-new-story') => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
      console.log(`[Sync] Background sync '${tag}' berhasil didaftarkan.`);
      return true;
    } catch (err) {
      console.error('[Sync] Gagal mendaftar background sync:', err);
      return false;
    }
  } else {
    console.warn('[Sync] Background Sync API tidak didukung di browser ini.');
    // Fallback: Langsung eksekusi logic (misal langsung call API)
    return false;
  }
};

// Simulasi function saat user pencet "Post Story" tapi sedang offline
export const mockOfflinePost = async (storyData) => {
  console.log('[Simulasi] Menyimpan data ke IndexedDB...', storyData);
  // (Logic IndexedDB Anda yang sudah ada dipanggil disini)
  
  // Daftarkan sync task
  await registerBackgroundSync('sync-new-story');
  alert('Anda sedang offline. Story disimpan dan akan diupload otomatis saat online!');
};
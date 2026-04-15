<template>
  <div class="notif-panel">
    <!-- Header -->
    <div class="panel-header">
      <div class="panel-title">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span>Notifikasi & Offline</span>
      </div>
      <span
        :class="['status-dot', permissionStatus]"
        :title="statusLabel"
      ></span>
    </div>

    <!-- Status Info -->
    <div class="status-card" :class="permissionStatus">
      <div class="status-icon">
        <svg
          v-if="permissionStatus === 'granted'"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          v-else-if="permissionStatus === 'denied'"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <svg
          v-else
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div class="status-text">
        <strong>{{ statusLabel }}</strong>
        <p>{{ statusDesc }}</p>
      </div>
    </div>

    <!-- Denied Warning -->
    <div v-if="permissionStatus === 'denied'" class="denied-warning">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span
        >Notifikasi diblokir. Buka
        <strong>Pengaturan Browser → Izin Situs → Notifikasi</strong> lalu
        aktifkan untuk <em>localhost</em>.</span
      >
    </div>

    <!-- Unsupported Warning -->
    <div v-if="permissionStatus === 'unsupported'" class="denied-warning">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span
        >Browser kamu tidak mendukung notifikasi. Coba pakai Chrome atau
        Edge.</span
      >
    </div>

    <!-- Action Buttons -->
    <div class="actions">
      <!-- Request Permission -->
      <button
        v-if="permissionStatus === 'default'"
        class="btn btn-primary"
        :disabled="isLoading"
        @click="handleRequestPermission"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        Aktifkan Notifikasi
      </button>

      <!-- Test Notification -->
      <button
        v-if="permissionStatus === 'granted'"
        class="btn btn-primary"
        :disabled="isLoading"
        @click="handleTestNotification"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
        {{ isLoading ? "Mengirim..." : "Test Notifikasi" }}
      </button>

      <!-- Subscribe Push -->
      <button
        v-if="permissionStatus === 'granted' && !isSubscribed"
        class="btn btn-secondary"
        :disabled="isLoading"
        @click="handleSubscribe"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12"
          />
          <path
            d="M22 16.92a19.79 19.79 0 0 0-3.07-8.63 19.5 19.5 0 0 0-6.91-6.91"
          />
        </svg>
        Subscribe Push
      </button>

      <!-- Unsubscribe -->
      <button
        v-if="isSubscribed"
        class="btn btn-danger"
        :disabled="isLoading"
        @click="handleUnsubscribe"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        Unsubscribe
      </button>

      <!-- Background Sync -->
      <button
        class="btn btn-sync"
        :disabled="isLoading || !syncSupported"
        @click="handleSync"
        :title="!syncSupported ? 'Browser tidak mendukung Background Sync' : ''"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="{ spinning: isSyncing }"
        >
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        {{ isSyncing ? "Syncing..." : "Test Background Sync" }}
      </button>
    </div>

    <!-- Log / Feedback -->
    <div v-if="logs.length > 0" class="log-panel">
      <div class="log-header">
        <span>Log</span>
        <button class="btn-clear-log" @click="logs = []">Hapus</button>
      </div>
      <div class="log-list">
        <div v-for="(log, i) in logs" :key="i" :class="['log-item', log.type]">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-msg">{{ log.msg }}</span>
        </div>
      </div>
    </div>

    <!-- Subscription Info -->
    <div v-if="isSubscribed" class="sub-info">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        stroke-width="2"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Push subscription aktif
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  requestNotificationPermission,
  sendLocalNotification,
  subscribePush,
  unsubscribePush,
  registerBackgroundSync,
  getNotificationStatus,
} from "@/notifications/push";

// ============================================================
// STATE
// ============================================================
const permissionStatus = ref("default"); // 'default' | 'granted' | 'denied' | 'unsupported'
const isSubscribed = ref(false);
const isLoading = ref(false);
const isSyncing = ref(false);
const syncSupported = ref(false);
const logs = ref([]);

// ============================================================
// COMPUTED
// ============================================================
const statusLabel = computed(() => {
  switch (permissionStatus.value) {
    case "granted":
      return "Notifikasi Aktif";
    case "denied":
      return "Notifikasi Diblokir";
    case "unsupported":
      return "Tidak Didukung";
    default:
      return "Belum Diaktifkan";
  }
});

const statusDesc = computed(() => {
  switch (permissionStatus.value) {
    case "granted":
      return "Kamu akan menerima notifikasi dari PathShare.";
    case "denied":
      return "Notifikasi diblokir oleh browser. Aktifkan manual di pengaturan.";
    case "unsupported":
      return "Browser ini tidak mendukung Web Push Notification.";
    default:
      return 'Klik "Aktifkan Notifikasi" untuk mulai menerima update.';
  }
});

// ============================================================
// HELPERS
// ============================================================
const addLog = (msg, type = "info") => {
  const now = new Date();
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  logs.value.unshift({ msg, type, time });
  // Maksimal 10 log
  if (logs.value.length > 10) logs.value.pop();
};

const checkSubscriptionStatus = async () => {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    isSubscribed.value = !!sub;
  } catch {
    isSubscribed.value = false;
  }
};

// ============================================================
// HANDLERS
// ============================================================
const handleRequestPermission = async () => {
  isLoading.value = true;
  addLog("Meminta izin notifikasi...", "info");
  try {
    const result = await requestNotificationPermission();
    permissionStatus.value = result;
    if (result === "granted") {
      addLog("Izin notifikasi diberikan!", "success");
    } else if (result === "denied") {
      addLog("Izin ditolak. Aktifkan manual di browser.", "error");
    }
  } catch (err) {
    addLog("Error: " + err.message, "error");
  } finally {
    isLoading.value = false;
  }
};

const handleTestNotification = async () => {
  isLoading.value = true;
  addLog("Mengirim notifikasi test...", "info");
  try {
    const success = await sendLocalNotification(
      "🚧 PathShare - Test Notifikasi",
      "Fitur notifikasi berjalan dengan baik! Ada laporan baru di sekitarmu.",
    );
    if (success) {
      addLog("Notifikasi berhasil dikirim!", "success");
    } else {
      addLog("Gagal kirim notifikasi.", "error");
    }
  } catch (err) {
    addLog("Error: " + err.message, "error");
  } finally {
    isLoading.value = false;
  }
};

const handleSubscribe = async () => {
  isLoading.value = true;
  addLog("Mencoba subscribe push...", "info");
  try {
    const sub = await subscribePush();
    if (sub) {
      isSubscribed.value = true;
      addLog(
        "Subscribe berhasil! Endpoint: " +
          sub.endpoint.substring(0, 40) +
          "...",
        "success",
      );
    } else {
      addLog(
        "Subscribe dilewati (tidak ada VAPID key atau permission belum granted).",
        "warn",
      );
    }
  } catch (err) {
    addLog("Error subscribe: " + err.message, "error");
  } finally {
    isLoading.value = false;
  }
};

const handleUnsubscribe = async () => {
  isLoading.value = true;
  addLog("Unsubscribe dari push...", "info");
  try {
    const success = await unsubscribePush();
    if (success) {
      isSubscribed.value = false;
      addLog("Unsubscribe berhasil.", "success");
    }
  } catch (err) {
    addLog("Error unsubscribe: " + err.message, "error");
  } finally {
    isLoading.value = false;
  }
};

const handleSync = async () => {
  isSyncing.value = true;
  addLog("Mendaftarkan Background Sync...", "info");
  try {
    const success = await registerBackgroundSync("sync-new-story");
    if (success) {
      addLog(
        "Background Sync terdaftar! Cek console SW di DevTools.",
        "success",
      );
    } else {
      addLog("Background Sync tidak didukung di browser ini.", "warn");
    }
  } catch (err) {
    addLog("Error sync: " + err.message, "error");
  } finally {
    setTimeout(() => {
      isSyncing.value = false;
    }, 2000);
  }
};

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(async () => {
  permissionStatus.value = getNotificationStatus();
  syncSupported.value = "SyncManager" in window;
  await checkSubscriptionStatus();
});
</script>

<style scoped>
.notif-panel {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(26, 58, 92, 0.08);
  border: 1px solid #e5e7eb;
  font-family: "Segoe UI", system-ui, sans-serif;
  max-width: 480px;
}

/* Header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #1a3a5c;
}
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-dot.granted {
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}
.status-dot.denied {
  background: #ef4444;
}
.status-dot.default {
  background: #f59e0b;
}
.status-dot.unsupported {
  background: #9ca3af;
}

/* Status Card */
.status-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 14px;
}
.status-card.granted {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}
.status-card.granted .status-icon {
  color: #16a34a;
}
.status-card.denied {
  background: #fef2f2;
  border: 1px solid #fecaca;
}
.status-card.denied .status-icon {
  color: #dc2626;
}
.status-card.default {
  background: #fffbeb;
  border: 1px solid #fde68a;
}
.status-card.default .status-icon {
  color: #d97706;
}
.status-card.unsupported {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}
.status-card.unsupported .status-icon {
  color: #9ca3af;
}

.status-icon {
  flex-shrink: 0;
  margin-top: 1px;
}
.status-text strong {
  font-size: 14px;
  color: #1f2937;
  display: block;
  margin-bottom: 2px;
}
.status-text p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Denied Warning */
.denied-warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  color: #92400e;
  margin-bottom: 14px;
  line-height: 1.5;
}
.denied-warning svg {
  flex-shrink: 0;
  margin-top: 1px;
  color: #d97706;
}

/* Actions */
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: #e07b2a;
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background: #c96a1e;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #2563eb;
  color: white;
}
.btn-secondary:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-danger {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.btn-danger:hover:not(:disabled) {
  background: #fecaca;
}

.btn-sync {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}
.btn-sync:hover:not(:disabled) {
  background: #dcfce7;
}

/* Spinning animation for sync icon */
.spinning {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* Log Panel */
.log-panel {
  background: #0f172a;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
}
.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: #1e293b;
}
.log-header span {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.btn-clear-log {
  background: none;
  border: none;
  color: #64748b;
  font-size: 11px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}
.btn-clear-log:hover {
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.05);
}

.log-list {
  padding: 8px;
  max-height: 160px;
  overflow-y: auto;
}
.log-item {
  display: flex;
  gap: 10px;
  font-size: 12px;
  padding: 5px 6px;
  border-radius: 4px;
  margin-bottom: 2px;
  font-family: "Courier New", monospace;
}
.log-time {
  color: #64748b;
  flex-shrink: 0;
}
.log-item.info .log-msg {
  color: #94a3b8;
}
.log-item.success .log-msg {
  color: #4ade80;
}
.log-item.error .log-msg {
  color: #f87171;
}
.log-item.warn .log-msg {
  color: #fbbf24;
}

/* Sub Info */
.sub-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #16a34a;
  padding: 8px 10px;
  background: #f0fdf4;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
}
</style>

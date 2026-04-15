<template>
  <div class="detail-page">
    <div class="page-content">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span @click="goBack" class="breadcrumb-link">Dashboard</span>
        <span class="breadcrumb-sep">/</span>
        <span @click="goBack" class="breadcrumb-link">Laporan</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">{{ story?.name || "Detail" }}</span>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Mengambil data laporan...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#e07b2a"
          stroke-width="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>{{ error }}</p>
        <div class="error-actions">
          <button @click="fetchStoryDetail" class="btn-retry">Coba Lagi</button>
          <button @click="goBack" class="btn-back-alt">Kembali</button>
        </div>
      </div>

      <!-- Detail Content -->
      <div v-else-if="story" class="detail-content">
        <!-- Header -->
        <div class="detail-header">
          <div class="header-title-area">
            <h1 class="page-label">Detail Pengaduan</h1>
            <h2 class="report-title">{{ story.name }}</h2>
            <span class="status-badge pending">Menunggu Tindakan</span>
          </div>
          <button class="btn-back" @click="goBack">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali
          </button>
        </div>

        <!-- Reporter Info -->
        <div class="reporter-row">
          <div class="reporter-info">
            <div class="reporter-avatar">
              <img
                v-if="story.photoUrl"
                :src="story.photoUrl"
                alt="Avatar"
                class="avatar-img"
              />
              <svg
                v-else
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p class="reporter-name">{{ story.name }}</p>
              <p class="reporter-date">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Dilaporkan pada: {{ formatDate(story.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="location-row" v-if="story.lat && story.lon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e07b2a"
            stroke-width="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{{ story.lat?.toFixed(4) }}, {{ story.lon?.toFixed(4) }}</span>
          <a
            :href="googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="map-link"
            >Buka di Peta ›</a
          >
        </div>

        <!-- Image & Map Grid -->
        <div class="media-grid">
          <div class="image-wrapper">
            <img :src="story.photoUrl" :alt="story.name" class="story-image" />
          </div>
          <div class="map-wrapper-container" v-if="story.lat && story.lon">
            <MapView
              :lat="story.lat"
              :lon="story.lon"
              :title="story.name"
              :image="story.photoUrl"
            />
          </div>
        </div>

        <!-- Detail Section -->
        <div class="detail-section">
          <h3>Detail Pengaduan</h3>
          <div class="detail-box">
            <div class="detail-status-line">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                stroke-width="2"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span class="detail-status-label">Menunggu Tindakan</span>
            </div>
            <p class="detail-description">{{ story.description }}</p>
          </div>
        </div>

        <!-- Status Timeline -->
        <div class="status-section">
          <h3>Status Laporan</h3>
          <div class="status-timeline">
            <div class="status-step active">
              <div class="step-icon active">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <span class="step-label">Menunggu Tindakan</span>
            </div>
            <div class="step-connector"></div>
            <div class="status-step">
              <div class="step-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  stroke-width="2"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  />
                </svg>
              </div>
              <span class="step-label">Dalam Proses</span>
            </div>
            <div class="step-connector"></div>
            <div class="status-step">
              <div class="step-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  stroke-width="2"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
              </div>
              <span class="step-label">Sedang Diperbaiki</span>
            </div>
            <div class="step-connector"></div>
            <div class="status-step">
              <div class="step-icon done">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  stroke-width="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span class="step-label">Selesai</span>
            </div>
          </div>
          <div class="status-info">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>
              Laporan Anda sudah diterima dan sedang menunggu tindak lanjut dari
              pihak terkait.
            </p>
          </div>
        </div>

        <!-- Comments & Side Cards Section -->
        <div class="bottom-split-section">
          <div class="comments-section">
            <div class="comments-header">
              <h3>
                Komentar
                <span class="comment-count">({{ comments.length }})</span>
              </h3>
              <a href="#" class="btn-see-all">Lihat Semua ›</a>
            </div>

            <div class="comments-list">
              <div
                v-for="(comment, index) in comments"
                :key="index"
                class="comment-item"
              >
                <div class="comment-avatar">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    stroke-width="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div class="comment-content">
                  <span class="comment-author">{{ comment.name }}</span>
                  <p class="comment-text">{{ comment.text }}</p>
                  <span class="comment-date">{{ comment.date }}</span>
                </div>
              </div>
            </div>

            <div class="comment-form">
              <textarea
                v-model="newComment"
                placeholder="Tambahkan komentar Anda..."
                class="comment-input"
              ></textarea>
              <button
                @click="postComment"
                :disabled="!newComment.trim()"
                class="btn-comment"
              >
                Kirim
              </button>
            </div>
          </div>

          <!-- Dummy Related Reports -->
          <div class="related-reports" v-if="story.lat && story.lon">
            <div class="related-card">
              <img :src="story.photoUrl" class="related-img" />
              <div class="related-info">
                <h4>Kerusakan Aspal</h4>
                <p>Bandung</p>
                <div class="related-status">
                  Status : <span class="status-green">Sedang Diperbaiki</span>
                </div>
              </div>
            </div>
            <div class="related-card">
              <img :src="story.photoUrl" class="related-img" />
              <div class="related-info">
                <h4>Trotoar Rusak</h4>
                <p>Surabaya</p>
                <div class="related-status">
                  Status : <span class="status-orange">Menunggu Tindakan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-inner">
        <!-- BRAND -->
        <div class="footer-brand-col">
          <div class="footer-brand">
            <img src="/icons/PathShare.png" class="brand-logo" />
            <span>PathShare</span>
          </div>
        </div>

        <!-- LINKS -->
        <div class="footer-links">
          <!-- Tentang -->
          <div class="footer-col">
            <h4>Tentang Kami</h4>
            <RouterLink to="/blog" class="footer-link"> 📘 Blog </RouterLink>
          </div>

          <!-- Navigasi -->
          <div class="footer-col">
            <h4>Navigasi</h4>
            <RouterLink to="/" class="footer-link">🏠 Beranda</RouterLink>
            <RouterLink to="/cara-kerja" class="footer-link"
              >⚙️ Cara Kerja</RouterLink
            >
            <RouterLink to="/laporan" class="footer-link"
              >📄 Laporan</RouterLink
            >
          </div>

          <!-- Bantuan -->
          <div class="footer-col">
            <h4>Bantuan</h4>
            <RouterLink to="/faq" class="footer-link">❓ FAQ</RouterLink>
            <RouterLink to="/contact" class="footer-link"
              >📞 Hubungi Kami</RouterLink
            >
          </div>

          <!-- Social -->
          <div class="footer-col">
            <h4>Ikuti Kami</h4>

            <div class="social-icons">
              <a href="#" class="social-icon">
                <Facebook size="18" />
              </a>

              <a href="#" class="social-icon">
                <Twitter size="18" />
              </a>

              <a href="#" class="social-icon">
                <Instagram size="18" />
              </a>

              <a href="#" class="social-icon">
                <Youtube size="18" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 PathShare. All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import API_ENDPOINT from "@/api-endpoint";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-vue-next";

const props = defineProps({ id: { type: String, required: true } });
const router = useRouter();

const story = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Lazy Load Komponen Map
const MapView = defineAsyncComponent({
  loader: () => import("@/components/MapView.vue"),
  // Tampilkan div loading sederhana saat file map sedang didownload
  loadingComponent: {
    template:
      '<div style="height: 320px; display: flex; align-items: center; justify-content: center; background: #e8f0f7; border-radius: 12px; color: #6b7280; font-weight: 600;">Memuat Peta...</div>',
  },
  delay: 200,
});

// Google Maps URL berdasarkan koordinat story
const googleMapsUrl = computed(() => {
  if (!story.value?.lat || !story.value?.lon) return "#";
  return `https://www.google.com/maps?q=${story.value.lat},${story.value.lon}`;
});

// Comments State
const comments = ref([]);
const newComment = ref("");

const postComment = () => {
  if (!newComment.value.trim()) return;
  const stored = localStorage.getItem("pathshare_auth");
  let userName = "Pengguna Anonim";
  if (stored) {
    try {
      const { user } = JSON.parse(stored);
      if (user && user.name) userName = user.name;
    } catch (e) {}
  }

  comments.value.unshift({
    name: userName,
    text: newComment.value,
    date: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  newComment.value = "";
};

const formatDate = (dateString) => {
  const opts = { year: "numeric", month: "long", day: "numeric" };
  return (
    new Date(dateString).toLocaleDateString("id-ID", opts) +
    " · Pukul " +
    new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

const fetchStoryDetail = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const stored = localStorage.getItem("pathshare_auth");
    const token = stored ? JSON.parse(stored).googleToken : null;
    if (!token) throw new Error("Anda belum login");

    const response = await fetch(
      `${API_ENDPOINT.BASE_URL}/stories/${props.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const responseJson = await response.json();
    if (!response.ok)
      throw new Error(responseJson.message || `HTTP Error: ${response.status}`);
    story.value = responseJson.story;
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => router.push("/");

onMounted(() => fetchStoryDetail());
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.detail-page {
  min-height: 100vh;
  background: #f0f2f5;
  font-family:
    "Segoe UI",
    system-ui,
    -apple-system,
    sans-serif;
}

/* Navbar */
.navbar {
  background: #1a3a5c;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(26, 58, 92, 0.2);
}
.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 20px;
  font-weight: 700;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}
.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
  border-bottom: 2px solid transparent;
  padding-bottom: 2px;
}
.nav-link:hover,
.nav-link.active {
  color: white;
  border-bottom-color: #e07b2a;
}
.btn-report {
  background: #e07b2a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-report:hover {
  background: #c96a1e;
}

.page-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 24px 48px;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 24px;
}
.breadcrumb-link {
  cursor: pointer;
  color: #2563eb;
  transition: color 0.2s;
}
.breadcrumb-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}
.breadcrumb-sep {
  color: #9ca3af;
}
.breadcrumb-current {
  color: #374151;
  font-weight: 500;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid #e8eef5;
  border-top: 4px solid #e07b2a;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
.loading-container p {
  color: #6b7280;
  font-size: 15px;
}

/* Error */
.error-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.error-state p {
  color: #6b7280;
  font-size: 15px;
  margin: 16px 0 24px;
}
.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.btn-retry {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-back-alt {
  background: white;
  color: #374151;
  border: 1.5px solid #d1d5db;
  padding: 11px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* Detail Content */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: white;
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.page-label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.report-title {
  font-size: 26px;
  font-weight: 800;
  color: #1a3a5c;
  margin-bottom: 12px;
  line-height: 1.3;
}
.status-badge {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 6px;
}
.status-badge.pending {
  background: #e07b2a;
  color: white;
}
.btn-back {
  display: flex;
  align-items: center;
  gap: 7px;
  background: white;
  border: 1.5px solid #d1d5db;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-back:hover {
  border-color: #1a3a5c;
  color: #1a3a5c;
}

/* Reporter */
.reporter-row {
  background: white;
  border-radius: 16px;
  padding: 20px 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.reporter-info {
  display: flex;
  align-items: center;
  gap: 14px;
}
.reporter-avatar {
  width: 46px;
  height: 46px;
  background: linear-gradient(135deg, #2563eb, #1a3a5c);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.reporter-name {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}
.reporter-date {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #6b7280;
}

/* Location */
.location-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 12px;
  padding: 14px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-size: 14px;
  color: #374151;
}
.map-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  font-size: 13px;
  display: inline-block;
}
.map-link:hover {
  text-decoration: underline;
}

/* Media Grid */
.media-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.image-wrapper {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.story-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
}

.map-placeholder {
  background: #e8f0f7;
  /* Optional: you can add a static google map image background here if you like */
  background-image: url("https://raw.githubusercontent.com/leaflet-extras/leaflet-providers/master/preview.jpg");
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 220px;
  border: 1px solid #d1d5db;
  padding: 24px;
  text-align: center;
}
.map-pin {
  margin-bottom: 4px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
.map-placeholder p {
  font-size: 14px;
  font-weight: 600;
  color: #1a3a5c;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
}
.btn-view-map {
  background: white;
  border: 1.5px solid #d1d5db;
  color: #374151;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.btn-view-map:hover {
  border-color: #1a3a5c;
  color: #1a3a5c;
}

/* Detail Box */
.detail-section h3,
.status-section h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1a3a5c;
  margin-bottom: 14px;
}
.detail-box {
  background: white;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.detail-status-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f3f4f6;
}
.detail-status-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}
.detail-description {
  font-size: 15px;
  line-height: 1.7;
  color: #4b5563;
  white-space: pre-wrap;
}

/* Status Timeline */
.status-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.status-timeline {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 8px;
}
.status-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}
.step-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
.step-icon.active {
  background: #e07b2a;
  border-color: #e07b2a;
  box-shadow: 0 0 0 4px rgba(224, 123, 42, 0.15);
}
.step-icon.done {
  background: #dcfce7;
  border-color: #16a34a;
}
.step-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-align: center;
}
.status-step:first-child .step-label {
  color: #e07b2a;
}
.step-connector {
  flex: 1;
  height: 2px;
  background: #e5e7eb;
  margin-top: -20px;
  min-width: 40px;
}
.status-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 14px 16px;
  background: #f9fafb;
  border-radius: 10px;
  border-left: 3px solid #e07b2a;
}
.status-info p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* Bottom Split Section (Comments + Related) */
.bottom-split-section {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;
  margin-top: 24px;
}

/* Comments Section */
.comments-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}
.comments-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1a3a5c;
}
.comment-count {
  font-weight: 400;
  color: #6b7280;
  font-size: 18px;
}
.btn-see-all {
  font-size: 13px;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
}
.btn-see-all:hover {
  background: #f9fafb;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
.comment-item {
  display: flex;
  gap: 12px;
}
.comment-avatar {
  width: 40px;
  height: 40px;
  background: #1a3a5c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.comment-content {
  flex: 1;
}
.comment-author {
  font-weight: 700;
  color: #111827;
  font-size: 15px;
  display: block;
  margin-bottom: 4px;
}
.comment-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  margin-bottom: 4px;
}
.comment-date {
  font-size: 12px;
  color: #9ca3af;
}

.comment-form {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}
.comment-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  font-size: 14px;
}
.comment-input:focus {
  outline: none;
  border-color: #e07b2a;
}
.btn-comment {
  background: #e07b2a;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-comment:disabled {
  background: #d1d5db;
}

/* Related Reports Section */
.related-reports {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.related-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.related-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}
.related-info {
  padding: 16px;
}
.related-info h4 {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}
.related-info p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
}
.related-status {
  font-size: 13px;
  color: #4b5563;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}
.status-green {
  color: #16a34a;
  font-weight: 600;
}
.status-orange {
  color: #e07b2a;
  font-weight: 600;
}

@media (max-width: 768px) {
  .report-main-grid,
  .bottom-split-section {
    grid-template-columns: 1fr;
  }
}

/* Footer */
.site-footer {
  background: #1a3a5c;
  color: rgba(255, 255, 255, 0.75);
  padding: 40px 24px 0;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.footer-brand-col {
  min-width: 140px;
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: white;
}
.brand-logo {
  width: 32px; /* Sesuaikan dengan keinginanmu */
  height: 32px;
  object-fit: contain; /* Agar gambar tidak gepeng */
  border-radius: 4px; /* Opsional: jika ingin sudutnya sedikit melengkung */
}
.footer-links {
  display: flex;
  gap: 48px;
  flex: 1;
  flex-wrap: wrap;
}
.footer-col h4 {
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}
.footer-link {
  display: block;
  font-size: 13px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: white;
}
.social-icons {
  display: flex;
  gap: 12px;
}

.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}
.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 0;
  font-size: 12px;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .media-grid {
    grid-template-columns: 1fr;
  }
  .detail-header {
    flex-direction: column;
    gap: 16px;
  }
  .status-timeline {
    gap: 0;
  }
}
</style>

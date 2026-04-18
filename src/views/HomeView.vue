<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-slider">
        <Transition name="fade">
          <div
            :key="currentSlide"
            class="hero-slide-item"
            :style="{ backgroundImage: `url(${heroImages[currentSlide]})` }"
          ></div>
        </Transition>
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <h1>Laporkan Jalan Rusak<br />di Sekitarmu</h1>
        <p>
          Bersama, kita perbaiki infrastruktur jalan untuk keselamatan bersama.
        </p>
        <div class="hero-actions">
          <RouterLink to="/create-story" class="btn-cta-primary"
            >Laporkan Sekarang</RouterLink
          >
          <button class="btn-cta-secondary" @click="router.push('/laporan')">
            Lihat Laporan
          </button>
        </div>
      </div>
    </section>

    <!-- Feature Highlights -->
    <section class="features">
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              stroke-width="2"
            >
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <div>
            <h3>Laporkan Mudah</h3>
            <p>Foto & Kirim Laporan dalam Hitungan Menit</p>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              stroke-width="2"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <h3>Pantau Progres</h3>
            <p>Pantau Status Perbaikan Jalan Anda</p>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              stroke-width="2"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h3>Solusi Cepat</h3>
            <p>Bantu Wujudkan Jalan yang Lebih Aman</p>
          </div>
        </div>
      </div>
    </section>

    <NotificationPanel />
    <!-- Map content -->
    <section class="map-section">
      <div class="section-header">
        <h2>Peta Laporan Terkini</h2>
        <p>
          Lihat lokasi jalan rusak yang telah dilaporkan oleh pengguna lain.
        </p>
      </div>
      <div id="map" class="home-map"></div>
    </section>
    <!-- Main Content -->
    <section class="main-content">
      <div class="section-header">
        <h2>Pengaduan Terbaru</h2>
        <button class="btn-outline">Lihat Semua</button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading-grid">
        <div v-for="n in 3" :key="n" class="skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skeleton-line long"></div>
            <div class="skeleton-line short"></div>
            <div class="skeleton-line medium"></div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#e07b2a"
            stroke-width="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p>{{ error }}</p>
        <button v-if="isAuthError" @click="goToLogin" class="btn-login-now">
          Login Sekarang
        </button>
        <button v-else @click="fetchStories" class="btn-retry">
          Coba Lagi
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="stories.length === 0" class="empty-state">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d1d5db"
          stroke-width="1"
        >
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p>Belum ada laporan yang dibagikan.</p>
      </div>

      <!-- Stories Grid -->
      <div v-else class="stories-grid">
        <div
          v-for="story in stories"
          :key="story.id"
          class="story-card"
          @click="goToDetail(story.id)"
        >
          <div class="card-image-wrapper">
            <img
              :src="story.photoUrl"
              :alt="story.name"
              class="card-image"
              loading="lazy"
            />
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ story.name }}</h3>
            <p class="card-location">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {{ story.description?.substring(0, 40) }}...
            </p>
            <div class="card-footer">
              <span class="status-badge pending">Menunggu Tindakan</span>
              <span class="card-date">{{ formatDate(story.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Banner -->
    <section class="stats-banner">
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">1.280</span>
          <span class="stat-label">Laporan Masuk</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">945</span>
          <span class="stat-label">Diproses</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">320</span>
          <span class="stat-label">Selesai Diperbaiki</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">85</span>
          <span class="stat-label">Kabupaten Terlibat</span>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ayo Bersama Perbaiki Jalan Kita!</h2>
        <p>
          Laporkan jalan rusak di daerahmu dan bantu ciptakan lingkungan yang
          lebih aman.
        </p>
        <RouterLink to="/create-story" class="btn-cta-primary"
          >Laporkan Sekarang</RouterLink
        >
      </div>
    </section>

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
import { ref, onMounted, onUnmounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "vue-router";
import API_ENDPOINT from "@/api-endpoint";
import NotificationPanel from "@/components/NotificationPanel.vue";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-vue-next";
import { fixLeafletIcon } from "@/utils/leaflet-icon-fix.js";
const router = useRouter();

const stories = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isAuthError = ref(false);

const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const getToken = () => {
  try {
    const stored = localStorage.getItem("pathshare_auth");
    if (!stored) return null;
    const { googleToken } = JSON.parse(stored);
    return googleToken || null;
  } catch {
    return null;
  }
};

let mapInstance = null;
const markers = []; // Untuk melacak marker yang ada jika ingin dibersihkan nanti

const initMap = () => {
  // ✅ FIX UTAMA — panggil SEBELUM L.map() dan L.marker()
    fixLeafletIcon();
  // Inisialisasi peta pertama kali
  mapInstance = L.map("map").setView([-6.2, 106.8166], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(mapInstance);
};

const renderMarkers = (data) => {
  if (!mapInstance) return;

  // Bersihkan marker lama jika perlu
  markers.forEach((marker) => mapInstance.removeLayer(marker));

  data.forEach((story) => {
    // Pastikan API mengirimkan lat dan lon
    if (story.lat !== null && story.lon !== null) {
      const marker = L.marker([story.lat, story.lon]).addTo(mapInstance)
        .bindPopup(`
          <div style="font-family: sans-serif;">
            <strong style="color: #1a3a5c;">${story.name}</strong><br>
            <p style="font-size: 12px; margin: 5px 0;">${story.description.substring(0, 50)}...</p>
            <button 
              onclick="window.dispatchEvent(new CustomEvent('go-to-story', {detail: '${story.id}'}))"
              style="background: #1a3a5c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; width: 100%;">
              Lihat Detail
            </button>
          </div>
        `);
      markers.push(marker);
    }
  });

  // Opsional: Otomatis arahkan peta agar semua marker terlihat
  if (markers.length > 0) {
    const group = new L.featureGroup(markers);
    mapInstance.fitBounds(group.getBounds().pad(0.1));
  }
};

onMounted(() => {
  initMap();
  fetchStories();
  startSlider();

  // Listener untuk tombol di dalam Popup Leaflet
  window.addEventListener("go-to-story", (e) => {
    goToDetail(e.detail);
  });
});

// Data Gambar Slider Hero
const heroImages = ref([
  "/asset/hero-home.png", // Pastikan path ini sesuai dengan file di folder public kamu
  "/asset/hero-home2.jpg",
  "/asset/hero-home3.jpg",
  "/asset/hero-home4.jpg",
]);
const currentSlide = ref(0);
let timer = null;

// Fungsi untuk menjalankan slider
const startSlider = () => {
  timer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % heroImages.value.length;
  }, 5000); // Berganti setiap 5 detik
};

// Bersihkan timer saat pindah halaman agar tidak memory leak
onUnmounted(() => {
  clearInterval(timer);
});

const fetchStories = async () => {
  isLoading.value = true;
  error.value = null;
  isAuthError.value = false;

  try {
    const token = getToken();
    if (!token) {
      isAuthError.value = true;
      throw new Error("Anda belum login. Silakan login terlebih dahulu.");
    }
    const response = await fetch(`${API_ENDPOINT.BASE_URL}/stories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const responseJson = await response.json();
    if (response.status === 401) {
      isAuthError.value = true;
      throw new Error("Sesi login habis. Silakan login kembali.");
    }
    if (!response.ok)
      throw new Error(responseJson.message || "Gagal mengambil data.");
    stories.value = responseJson.listStory;
    renderMarkers(stories.value);
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const goToDetail = (id) => router.push(`/story/${id}`);
const goToLogin = () => router.push({ name: "Login" });
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-page {
  min-height: 100vh;
  font-family:
    "Segoe UI",
    system-ui,
    -apple-system,
    sans-serif;
  background: #f0f2f5;
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
  transform: translateY(-1px);
}

/* Hero */
.hero {
  position: relative;
  overflow: hidden; /* Penting agar gambar tidak keluar jalur */
  min-height: 550px;
  display: flex;
  align-items: center;
}

.hero-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-slide-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Overlay gelap agar teks putih tetap kontras */

  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 560px;
  margin: 0 auto 0 calc(50% - 550px);

  /* Efek Kaca */
  background: rgba(255, 255, 255, 0.1); /* Putih tipis sekali */
  backdrop-filter: blur(
    8px
  ); /* Membuat gambar di belakang tulisan jadi blur halus */
  -webkit-backdrop-filter: blur(8px);
  padding: 40px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.hero-content h1 {
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Sedikit bayangan agar makin tajam */
}

/* Animasi Fade Vue */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hero-content h1 {
  font-size: 40px;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 16px;
}
.hero-content p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 28px;
  line-height: 1.6;
}
.hero-actions {
  display: flex;
  gap: 14px;
}
.btn-cta-primary {
  background: #e07b2a;
  color: white;
  border: none;
  padding: 13px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cta-primary:hover {
  background: #c96a1e;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(224, 123, 42, 0.4);
}
.btn-cta-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.7);
  padding: 13px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cta-secondary:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.1);
}

/* Features */
.features {
  background: white;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.features-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.feature-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}
.feature-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
}
.feature-icon {
  width: 52px;
  height: 52px;
  background: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.feature-card h3 {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}
.feature-card p {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

/* Main content */
.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.section-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1a3a5c;
}
.btn-outline {
  border: 1.5px solid #1a3a5c;
  background: white;
  color: #1a3a5c;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover {
  background: #1a3a5c;
  color: white;
}

/* map content  */
.map-section {
  padding: 60px 20px;
  background: #f8fafc;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.home-map {
  height: 450px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1; /* Pastikan tidak menutupi navbar */
}

/* Loading Skeleton */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.skeleton-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: pulse 1.5s infinite;
}
.skeleton-img {
  height: 180px;
  background: #e5e7eb;
}
.skeleton-body {
  padding: 16px;
}
.skeleton-line {
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  margin-bottom: 10px;
}
.skeleton-line.long {
  width: 80%;
}
.skeleton-line.medium {
  width: 60%;
}
.skeleton-line.short {
  width: 40%;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Error & Empty */
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.error-icon {
  margin-bottom: 16px;
}
.error-state p,
.empty-state p {
  color: #6b7280;
  font-size: 15px;
  margin-bottom: 20px;
  margin-top: 8px;
}
.btn-login-now {
  background: #2563eb;
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
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

/* Stories Grid */
.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 22px;
}
.story-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.25s;
  border: 1px solid #e5e7eb;
}
.story-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(26, 58, 92, 0.14);
  border-color: #bfdbfe;
}
.card-image-wrapper {
  overflow: hidden;
  height: 190px;
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}
.story-card:hover .card-image {
  transform: scale(1.05);
}
.card-body {
  padding: 16px;
}
.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a3a5c;
  margin-bottom: 6px;
  line-height: 1.3;
}
.card-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.4;
}
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}
.status-badge.pending {
  background: #fff3e0;
  color: #e07b2a;
}
.status-badge.in-progress {
  background: #e8f5e9;
  color: #2e7d32;
}
.status-badge.done {
  background: #e3f2fd;
  color: #1565c0;
}
.card-date {
  font-size: 11px;
  color: #9ca3af;
}

/* Stats */
.stats-banner {
  background: white;
  padding: 40px 24px;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}
.stats-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
}
.stat-number {
  display: block;
  font-size: 36px;
  font-weight: 800;
  color: #1a3a5c;
  margin-bottom: 6px;
}
.stat-label {
  font-size: 14px;
  color: #6b7280;
}

/* CTA */
.cta-section {
  position: relative;
  padding: 100px 24px; /* Sedikit diperlebar agar gambar lebih terlihat */
  text-align: center;

  /* Gabungkan overlay gelap dan gambar */
  /* Ganti 'path-ke-gambar-kamu.jpg' dengan lokasi file gambar Anda */
  background: url("/public/asset/CTA.png");

  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Memberikan efek parallax yang mewah */
  color: white; /* Mengubah default teks di section ini menjadi putih */
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 32px; /* Diperbesar sedikit agar lebih standout */
  font-weight: 800;
  color: red; /* Pakai warna putih agar kontras dengan gambar */
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* Tambahkan bayangan halus */
}

.cta-content p {
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 32px;
  line-height: 1.6;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
}

/* Pastikan tombol tetap terlihat jelas */
.btn-cta-primary {
  background: #e07b2a;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(224, 123, 42, 0.3);
}

.btn-cta-primary:hover {
  background: #c96a1e;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(224, 123, 42, 0.4);
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
  .hero {
    padding: 48px 20px;
  }
  .hero-content {
    margin: 0;
  }
  .hero-content h1 {
    font-size: 28px;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stories-grid {
    grid-template-columns: 1fr;
  }
}
</style>

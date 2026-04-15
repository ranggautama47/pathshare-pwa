<template>
  <div class="notfound-page">
    <div class="notfound-content">
      <!-- Road Illustration -->
      <div class="illustration">
        <svg
          width="200"
          height="160"
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Road -->
          <rect x="60" y="80" width="80" height="60" rx="4" fill="#374151" />
          <rect x="60" y="80" width="80" height="60" rx="4" fill="#374151" />
          <!-- Road markings -->
          <rect
            x="98"
            y="90"
            width="4"
            height="14"
            rx="2"
            fill="white"
            opacity="0.6"
          />
          <rect
            x="98"
            y="112"
            width="4"
            height="14"
            rx="2"
            fill="white"
            opacity="0.6"
          />
          <!-- Pothole -->
          <ellipse cx="100" cy="100" rx="18" ry="12" fill="#1f2937" />
          <ellipse cx="97" cy="98" rx="12" ry="8" fill="#111827" />
          <!-- Warning triangle -->
          <polygon points="100,30 75,72 125,72" fill="#e07b2a" opacity="0.9" />
          <polygon points="100,38 80,68 120,68" fill="#f59e0b" />
          <rect x="97" y="46" width="6" height="14" rx="3" fill="#1a3a5c" />
          <rect x="97" y="64" width="6" height="6" rx="3" fill="#1a3a5c" />
          <!-- Cones -->
          <polygon points="40,140 32,100 48,100" fill="#e07b2a" />
          <rect
            x="28"
            y="138"
            width="24"
            height="4"
            rx="2"
            fill="white"
            opacity="0.5"
          />
          <rect
            x="32"
            y="118"
            width="16"
            height="4"
            rx="2"
            fill="white"
            opacity="0.5"
          />
          <polygon points="160,140 152,100 168,100" fill="#e07b2a" />
          <rect
            x="148"
            y="138"
            width="24"
            height="4"
            rx="2"
            fill="white"
            opacity="0.5"
          />
          <rect
            x="152"
            y="118"
            width="16"
            height="4"
            rx="2"
            fill="white"
            opacity="0.5"
          />
        </svg>
      </div>

      <div class="error-code">404</div>
      <h1 class="error-title">Halaman Tidak Ditemukan</h1>
      <p class="error-desc">
        Seperti jalan berlubang — halaman yang kamu cari tidak ada atau sudah
        dipindahkan.<br />
        Yuk kembali ke jalur yang benar!
      </p>

      <div class="action-buttons">
        <button class="btn-home" @click="goHome">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Kembali ke Beranda
        </button>
        <button class="btn-report" @click="goHome">Laporkan Jalan Rusak</button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand-col">
          <div class="footer-brand">
            <img
              src="/icons/PathShare.png"
              alt="PathShare Logo"
              class="brand-logo"
            />
            <span>PathShare</span>
          </div>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h4>Tentang Kami</h4>
            <p>Blog</p>
          </div>
          <div class="footer-col">
            <h4>Navigasi</h4>
            <p>Beranda</p>
            <p>Cara Kerja</p>
            <p>Laporan</p>
          </div>
          <div class="footer-col">
            <h4>Bantuan</h4>
            <p>Panduan Laporan</p>
            <p>FAQ</p>
          </div>
          <div class="footer-col">
            <h4>Ikuti Kami</h4>
            <div class="social-icons">
              <span class="social-icon">f</span>
              <span class="social-icon">𝕏</span>
              <span class="social-icon">◎</span>
              <span class="social-icon">▶</span>
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
import { useRouter } from "vue-router";
const router = useRouter();
const goHome = () => router.push({ name: "Home" });
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.notfound-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  font-family:
    "Segoe UI",
    system-ui,
    -apple-system,
    sans-serif;
}

.notfound-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
}

.illustration {
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-code {
  font-size: 96px;
  font-weight: 900;
  color: #1a3a5c;
  line-height: 1;
  margin-bottom: 16px;
  opacity: 0.12;
  position: absolute;
  pointer-events: none;
}

.error-title {
  font-size: 32px;
  font-weight: 800;
  color: #1a3a5c;
  margin-bottom: 16px;
}

.error-desc {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.7;
  max-width: 440px;
  margin-bottom: 40px;
}

.action-buttons {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-home {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1a3a5c;
  color: white;
  border: none;
  padding: 13px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-home:hover {
  background: #15304d;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(26, 58, 92, 0.3);
}

.btn-report {
  background: #e07b2a;
  color: white;
  border: none;
  padding: 13px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-report:hover {
  background: #c96a1e;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(224, 123, 42, 0.35);
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
.footer-col p {
  font-size: 13px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: color 0.2s;
}
.footer-col p:hover {
  color: white;
}
.social-icons {
  display: flex;
  gap: 10px;
}
.social-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}
.social-icon:hover {
  background: rgba(255, 255, 255, 0.25);
}
.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 0;
  font-size: 12px;
  opacity: 0.6;
}
</style>

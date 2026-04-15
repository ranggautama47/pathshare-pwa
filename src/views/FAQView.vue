<template>
  <div class="static-page">
    <h1>❓ FAQ</h1>
    <div class="faq-item">
      <h3>Bagaimana cara melapor?</h3>
      <p>
        Klik tombol 'Laporkan Jalan Rusak', unggah foto, dan tentukan lokasi.
      </p>
    </div>
  </div>
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
          <RouterLink to="/laporan" class="footer-link">📄 Laporan</RouterLink>
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
</template>
<script setup>
import { Facebook, Twitter, Instagram, Youtube } from "lucide-vue-next";
</script>
<style scoped>
.static-page {
  padding: 80px 20px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 60vh;
}
.faq-item {
  margin-top: 20px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
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
</style>

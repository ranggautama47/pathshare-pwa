<template>
  <div class="contact-page">
    <section
      class="contact-hero"
      :style="{ backgroundImage: `url('/asset/hero-hubungikami.png')` }"
    >
      <div class="hero-content">
        <h1>Hubungi Kami</h1>
        <p>
          Ada pertanyaan, masukan atau keluhan?<br />
          Hubungi kami, kami siap membantu!
        </p>
      </div>
    </section>

    <section class="contact-container">
      <div class="contact-wrapper">
        <div class="contact-form-card">
          <h2>Formulir Kontak</h2>
          <form @submit.prevent>
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                placeholder="Nama Lengkap"
              />
            </div>
            <div class="form-group">
              <input type="email" class="form-control" placeholder="Email" />
            </div>
            <div class="form-group">
              <select class="form-control" defaultValue="">
                <option value="" disabled selected>Subjek</option>
                <option value="pertanyaan">Pertanyaan Umum</option>
                <option value="bantuan">Bantuan Teknis</option>
                <option value="keluhan">Keluhan</option>
              </select>
            </div>
            <div class="form-group">
              <textarea
                class="form-control"
                placeholder="Pesan"
                rows="5"
              ></textarea>
            </div>
            <button type="submit" class="submit-btn">Kirim Pesan</button>
          </form>
        </div>

        <div class="contact-info-card">
          <h2>Kontak informasi</h2>

          <div class="info-item">
            <MapPin class="info-icon" size="24" />
            <div class="info-text">
              <p><strong>Kantor Pusat PathShare</strong></p>
              <p>Jl. Sudirman No. 1<br />Jakarta, Indonesia 12345</p>
            </div>
          </div>

          <div class="info-item">
            <Phone class="info-icon" size="24" />
            <div class="info-text">
              <p>0881 1503 0000</p>
            </div>
          </div>

          <div class="info-item">
            <Mail class="info-icon" size="24" />
            <div class="info-text">
              <p>support@pathshare.id</p>
            </div>
          </div>

          <div class="info-item">
            <Clock class="info-icon" size="24" />
            <div class="info-text">
              <p><strong>Jam Kerja</strong></p>
              <p>Senin - Jumat: 09:00 - 17:00</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand-col">
          <div class="footer-brand">
            <img
              src="/icons/PathShare.png"
              class="brand-logo"
              alt="PathShare Logo"
            />
            <span>PathShare</span>
          </div>
        </div>

        <div class="footer-links">
          <div class="footer-col">
            <h4>Tentang Kami</h4>
            <RouterLink to="/blog" class="footer-link"> 📘 Blog </RouterLink>
          </div>

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

          <div class="footer-col">
            <h4>Bantuan</h4>
            <RouterLink to="/faq" class="footer-link">❓ FAQ</RouterLink>
            <RouterLink to="/contact" class="footer-link"
              >📞 Hubungi Kami</RouterLink
            >
          </div>

          <div class="footer-col">
            <h4>Ikuti Kami</h4>
            <div class="social-icons">
              <a href="#" class="social-icon"><Facebook size="18" /></a>
              <a href="#" class="social-icon"><Twitter size="18" /></a>
              <a href="#" class="social-icon"><Instagram size="18" /></a>
              <a href="#" class="social-icon"><Youtube size="18" /></a>
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
// Tambahkan MapPin, Phone, Mail, dan Clock untuk ikon informasi kontak
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-vue-next";
</script>

<style scoped>
.contact-page {
  width: 100%;
  min-height: 80vh;
  background-color: #f8fafc; /* Warna background abu-abu/biru super terang seperti di gambar */
}

/* Hero Section */
.contact-hero {
  position: relative;
  height: 650px;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-start; /* Teks agak di atas */
  padding-top: 80px;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 500px; /* Dipersempit agar kotak blur hanya membungkus teks */
  margin: 0; /* Menghilangkan auto agar rata kiri, atau sesuaikan dengan layoutmu */
  width: 100%;
  padding: 24px;

  /* Kunci untuk efek Gaussian Blur */
  background-color: rgba(255, 255, 255, 0.4); /* Putih semi-transparan */
  backdrop-filter: blur(12px); /* Mengatur tingkat keburaman */
  -webkit-backdrop-filter: blur(12px); /* Dukungan untuk browser Safari */

  border-radius: 16px; /* Membuat sudut kotak sedikit membulat agar lebih manis */
  border: 1px solid rgba(255, 255, 255, 0.5); /* Opsional: garis tepi tipis khas efek kaca */
}

.hero-content h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #1a3a5c;
}

.hero-content p {
  font-size: 1.1rem;
  color: #334155;
  line-height: 1.6;
}

/* Container & Wrapper */
.contact-container {
  max-width: 1100px;
  margin: -150px auto 80px; /* Overlap ke atas (ke area hero) */
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

.contact-wrapper {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

/* Left Column: Form */
.contact-form-card {
  flex: 1.5;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.contact-form-card h2 {
  color: #1a3a5c;
  margin-bottom: 24px;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #334155;
  outline: none;
  transition: border-color 0.2s;
  background-color: #fefefe;
  font-family: inherit;
}

.form-control:focus {
  border-color: #1a56db;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  background: #1a56db;
  color: white;
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #1e40af;
}

/* Right Column: Info */
.contact-info-card {
  flex: 1;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-top: 80px; /* Sengaja didorong ke bawah agar menyisakan ruang untuk ilustrasi orang di background */
}

.contact-info-card h2 {
  color: #1a3a5c;
  margin-bottom: 24px;
  font-size: 1.5rem;
}

.info-item {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-start;
}

.info-icon {
  color: #1a3a5c;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text p {
  color: #475569;
  font-size: 0.95rem;
  margin: 0 0 4px 0;
  line-height: 1.5;
}

.info-text strong {
  color: #1a3a5c;
}

/* Footer (Tetap sama seperti aslinya) */
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
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
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

/* Responsif untuk Mobile */
@media (max-width: 860px) {
  .contact-wrapper {
    flex-direction: column;
  }
  .contact-info-card {
    margin-top: 0; /* Kembalikan margin di mobile */
    width: 100%;
  }
  .contact-form-card {
    width: 100%;
  }
  .contact-hero {
    height: 350px;
  }
  .hero-content h1 {
    font-size: 2.2rem;
  }
}
</style>

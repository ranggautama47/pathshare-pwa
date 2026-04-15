<template>
  <div class="cara-kerja-page">

    <!-- =========================================
         HERO — background image hero-carakerja.png
    ========================================= -->
    <section class="hero-section">
      <div class="hero-inner">
        <div class="hero-text">
          <h1>Bagaimana PathShare<br />Bekerja?</h1>
          <p>Laporkan kerusakan jalan hanya dalam beberapa langkah mudah</p>
          <button class="btn-hero" @click="handleReport">Mulai Laporkan Sekarang</button>
        </div>
      </div>
    </section>

    <!-- =========================================
         4 LANGKAH
    ========================================= -->
    <section class="steps-section">
      <h2 class="section-title">Bagaimana PathShare</h2>

      <div class="steps-row">
        <div class="step-item" v-for="(step, i) in steps" :key="i">
          <div :class="['step-num', i % 2 === 0 ? 'orange' : 'blue']">{{ i + 1 }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
        </div>
      </div>

      <div class="action-center">
        <button class="btn-orange-large" @click="handleReport">Mulai Laporkan Sekarang</button>
      </div>
    </section>

    <!-- =========================================
         FITUR UNGGULAN (2x2 grid)
    ========================================= -->
    <section class="features-section">
      <div class="features-grid">
        <div class="feat-item" v-for="feat in features" :key="feat.title">
          <div class="feat-icon" v-html="feat.icon"></div>
          <div>
            <h3>{{ feat.title }}</h3>
            <p>{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const steps = [
  {
    title: 'Ambil Foto',
    desc: 'Ambil foto jalan rusak yang jelas dari dekat agar kondisi kerusakan terlihat nyata dari Gilasi.'
  },
  {
    title: 'Tambahkan Lokasi',
    desc: 'Tandai lokasi kerusakan di peta, tambahkan ket sat betul an dn tindap serlitasi.'
  },
  {
    title: 'Kirim Laporan',
    desc: 'Isi deskripsi singkat kondisi kerusakan, lnutoo togga olt Peto at saporan.'
  },
  {
    title: 'Pantau Progres',
    desc: 'Lacak status laporan secara real-time, Lintu jallan, jilastaa metos, dan datton addake.'
  }
]

const features = [
  {
    title: 'Cepat & Mudah',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e07b2a" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>`,
    desc: 'Lakkasi mauro malta henaoya, berfligun coib tlmer rerngas, sewuobar uposh.'
  },
  {
    title: 'Transparan',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e07b2a" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    desc: 'Sart,Lcar ugian drsebon naggla san maes suh becelr. ot fetorat lengiila.'
  },
  {
    title: 'Terhubung dengan pemerintah',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e07b2a" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    desc: 'Laportan:xin laporan io Golcoo tartigai arobngan bkosry, turpaa partbsin.'
  },
  {
    title: 'Partisipasi masyarakat',
    icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e07b2a" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    desc: 'Pertangsuk: utilan laporan suil rl rending rnangutabc:ok dan flstury sarnegat.'
  }
]

const handleReport = () => {
  const auth = localStorage.getItem('pathshare_auth')
  router.push(auth ? '/create-story' : '/login')
}
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.cara-kerja-page {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: #f0f2f5;
}

/* ============================
   HERO — pakai hero-carakerja.png
============================ */
.hero-section {
 background: 
    linear-gradient(to right, rgba(26, 58, 92, 0.9) 10%, rgba(26, 58, 92, 0) 80%),
    url('/asset/hero-carakerja.png') center right / cover no-repeat;
  min-height: 700px; 
  height: 60vh; /* Mengikuti tinggi layar agar tidak terlalu besar di monitor kecil */
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 80px;
  width: 100%;
}

.hero-text {
  color: white;
  max-width: 480px;
}

.hero-text h1 {
  font-size: 36px;
  font-weight: 900;
  line-height: 1.22;
  margin-bottom: 14px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.hero-text p {
  font-size: 16px;
  opacity: 0.88;
  margin-bottom: 28px;
  line-height: 1.65;
}

.btn-hero {
  background: #e07b2a;
  color: white;
  border: none;
  padding: 13px 26px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(224,123,42,0.4);
}
.btn-hero:hover { background: #c96a1e; transform: translateY(-1px); }

/* ============================
   4 LANGKAH
============================ */
.steps-section {
  background: white;
  padding: 60px 24px 50px;
}

.section-title {
  text-align: center;
  font-size: 26px;
  font-weight: 800;
  color: #1a3a5c;
  margin-bottom: 40px;
}

.steps-row {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.step-item {
  text-align: center;
  padding: 26px 16px 22px;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  transition: all 0.22s;
}
.step-item:hover {
  border-color: #bfdbfe;
  box-shadow: 0 6px 20px rgba(26,58,92,0.09);
  transform: translateY(-3px);
}

.step-num {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  margin: 0 auto 16px;
}
.step-num.orange { background: #e07b2a; color: white; }
.step-num.blue   { background: #1a3a5c; color: white; }

.step-item h3 {
  font-size: 14px;
  font-weight: 700;
  color: #1a3a5c;
  margin-bottom: 8px;
}
.step-item p {
  font-size: 12px;
  color: #64748b;
  line-height: 1.65;
}

.action-center {
  text-align: center;
  margin-top: 40px;
}

/* ============================
   FEATURES 2x2
============================ */
.features-section {
  background: #f0f2f5;
  padding: 52px 24px;
}

.features-grid {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feat-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  padding: 22px 20px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}
.feat-item:hover {
  border-color: #bfdbfe;
  box-shadow: 0 4px 16px rgba(26,58,92,0.07);
}

.feat-icon {
  width: 50px;
  height: 50px;
  background: #fff7ed;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feat-item h3 {
  font-size: 14px;
  font-weight: 700;
  color: #1a3a5c;
  margin-bottom: 6px;
}
.feat-item p {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}



.btn-orange-large,
.btn-orange-outline {
  background: #e07b2a;
  color: white;
  border: none;
  padding: 13px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(224,123,42,0.38);
}
.btn-orange-large:hover,
.btn-orange-outline:hover { background: #c96a1e; transform: translateY(-1px); }

/* ============================
   RESPONSIVE
============================ */
@media (max-width: 900px) {
  .steps-row { grid-template-columns: repeat(2, 1fr); }
  .features-grid { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .hero-text h1 { font-size: 24px; }
  .hero-inner { padding: 40px 20px; }
  .steps-row { grid-template-columns: 1fr 1fr; gap: 12px; }
  .footer-banner-inner { flex-direction: column; text-align: center; }
}
</style>
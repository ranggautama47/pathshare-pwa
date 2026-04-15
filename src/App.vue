<template>
  <div class="app-shell">
    <nav class="navbar">
      <div class="nav-inner">
        <div class="nav-brand">
          <img
            src="/icons/PathShare.png"
            alt="PathShare Logo"
            class="brand-logo"
          />
          <span>PathShare</span>
        </div>

        <div class="nav-links">
          <RouterLink to="/" class="nav-link" active-class="active"
            >Beranda</RouterLink
          >
          <RouterLink to="/cara-kerja" class="nav-link" active-class="active"
            >Cara Kerja</RouterLink
          >
          <RouterLink to="/laporan" class="nav-link" active-class="active"
            >Laporan</RouterLink
          >
          <button class="btn-report" @click="goToCreate">
            Laporkan Jalan Rusak
          </button>

          <button
            v-if="!isLoggedIn"
            @click="goToLogin"
            class="btn-auth btn-login"
          >
            Login
          </button>
          <button v-else @click="handleLogout" class="btn-auth btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content-app">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);

// Fungsi untuk mengecek apakah user sudah login
const checkAuth = () => {
  const token1 = localStorage.getItem("pathshare_auth");
  const token2 = localStorage.getItem("token"); // Jaga-jaga kalau nyimpen pakai nama 'token'
  if (token1 || token2) {
    isLoggedIn.value = true;
  } else {
    isLoggedIn.value = false;
  }
};

// Cek saat komponen dimuat
onMounted(() => {
  checkAuth();
});

// Pantau perubahan route, siapa tau baru selesai login
watch(route, () => {
  checkAuth();
});

// 1. Alert Cantik untuk "Harus Login"
const goToCreate = () => {
  if (!isLoggedIn.value) {
    Swal.fire({
      icon: "warning",
      title: "Akses Dibatalkan",
      text: "Silakan login terlebih dahulu untuk membuat laporan.",
      confirmButtonColor: "#e07b2a",
      confirmButtonText: "Login Sekarang",
      showCancelButton: true,
      cancelButtonText: "Nanti Saja",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/login");
      }
    });
  } else {
    router.push("/create-story");
  }
};

const goToLogin = () => {
  router.push("/login");
};

// 2. Konfirmasi Logout yang Aman
const handleLogout = () => {
  Swal.fire({
    title: "Yakin ingin Logout?",
    text: "Anda harus login kembali untuk membuat laporan baru.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#e07b2a",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Ya, Logout!",
    cancelButtonText: "Batal",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // Hapus data
      localStorage.removeItem("pathshare_auth");
      localStorage.removeItem("token");
      isLoggedIn.value = false;

      // Toast sukses kecil di pojok
      Swal.fire({
        icon: "success",
        title: "Berhasil Logout",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      router.push("/login");
    }
  });
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-shell {
  min-height: 100vh;
  font-family:
    "Segoe UI",
    system-ui,
    -apple-system,
    sans-serif;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
}

/* Navbar Style (Diambil dari HomeView kamu yang bagus) */
.navbar {
  background: #1a3a5c;
  position: sticky;
  top: 0;
  z-index: 1000;
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
.brand-logo {
  width: 32px; /* Sesuaikan dengan keinginanmu */
  height: 32px;
  object-fit: contain; /* Agar gambar tidak gepeng */
  border-radius: 4px; /* Opsional: jika ingin sudutnya sedikit melengkung */
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 20px;
  font-weight: 700;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
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
  padding: 8px 16px;
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

/* Auth Buttons */
.btn-auth {
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-login {
  background: white;
  color: #1a3a5c;
}
.btn-login:hover {
  background: #e2e8f0;
}
.btn-logout {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
}
.btn-logout:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

.main-content-app {
  flex: 1;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>

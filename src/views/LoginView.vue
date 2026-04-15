<template>
  <div class="login-page">
    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-overlay"></div>
    </div>

    <!-- Login Section -->
    <div class="login-section">
      <h1 class="login-title">Masuk ke Akun Anda</h1>

      <div class="login-card">
        <!-- Error Alert -->
        <div v-if="error" class="alert-error">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {{ error }}
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="spinner"></div>
          <p>Sedang masuk...</p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper">
              <svg
                class="input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                v-model="form.email"
                type="email"
                id="email"
                placeholder="Email"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <svg
                class="input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                placeholder="Password"
                required
                minlength="6"
                :disabled="isLoading"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <svg
                  v-if="showPassword"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <div class="forgot-link-row">
            <a href="#" class="forgot-link">Lupa Password?</a>
          </div>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? "Memproses..." : "Masuk" }}
          </button>
        </form>

        <p class="register-link">
          Belum punya akun?
          <a @click.prevent="goToRegister" href="#">Daftar</a>
        </p>

        <div class="divider"><span>Atau masuk dengan</span></div>

        <div class="social-buttons">
          <button
            class="btn-social"
            @click="handleGoogleLogin"
            :disabled="isLoading"
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/module/auth";
import API_ENDPOINT from "@/api-endpoint";
import { initGoogleAuth } from "@/auth/googleAuth";
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-vue-next'

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);
const error = ref(null);
const form = ref({ email: "", password: "" });
const showPassword = ref(false);

async function handleLogin() {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await fetch(`${API_ENDPOINT.BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password,
      }),
    });
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(
        data.message || "Login gagal. Periksa email dan password.",
      );
    }

    const { token, userId, name } = data.loginResult;
    authStore.setGoogleToken(token);
    authStore.setUser({ id: userId, name, email: form.value.email });
    router.push({ name: "Home" });
  } catch (err) {
    error.value = err.message || "Login gagal. Coba lagi.";
    isLoading.value = false;
  }
}

async function handleGoogleLogin() {
  try {
    isLoading.value = true;
    error.value = null;

    const onSuccess = async (payload) => {
      try {
        const email = payload.email;
        const name = payload.name;
        // Password rahasia khusus akun Google
        const defaultPassword = "GoogleAuth123!@#";

        // 1. Coba login ke API Dicoding
        let res = await fetch(`${API_ENDPOINT.BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: defaultPassword }),
        });
        let data = await res.json();

        // 2. Jika belum terdaftar, lakukan registrasi ke API Dicoding dulu
        if (data.error) {
          const regRes = await fetch(`${API_ENDPOINT.BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password: defaultPassword }),
          });
          const regData = await regRes.json();
          if (regData.error) throw new Error(regData.message);

          // Coba login lagi setelah berhasil register
          res = await fetch(`${API_ENDPOINT.BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password: defaultPassword }),
          });
          data = await res.json();
          if (data.error) throw new Error(data.message);
        }

        // 3. Simpan token ASLI dari API Dicoding
        const { token, userId } = data.loginResult;
        authStore.setGoogleToken(token);
        authStore.setUser({
          id: userId,
          name: name || data.loginResult.name,
          email: email,
          picture: payload.picture || null,
        });

        router.push({ name: "Home" });
      } catch (err) {
        error.value = "Gagal sinkronisasi API: " + err.message;
        isLoading.value = false;
      }
    };

    initGoogleAuth(onSuccess);
    if (window.google) window.google.accounts.id.prompt();
  } catch (err) {
    error.value = err.message || "Google Sign-In gagal.";
    isLoading.value = false;
  }
}

function goToRegister() {
  router.push({ name: "Register" });
}

authStore.loadUserFromStorage();
if (authStore.isAuthenticated) router.push({ name: "Home" });
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
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

/* Hero Banner */
.hero-banner {
  position: relative;
  background-image: url("/asset/login.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  height: 380px;
  overflow: hidden;
}

.hero-banner::after {
  content: none;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background-color: transparent; /* Menghilangkan warna biru pekat */
  z-index: 1;
}

.navbar-brand {
  position: relative;
  top: 24px;
  left: 28px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 2;
}

.brand-name {
  color: white;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

/* Login Section */
.login-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 40px;
  margin-top: -60px;
  position: relative;
  z-index: 1;
}

.login-title {
  font-size: 40px;
  font-weight: 700;
  color: #f0f2f5;
  margin-bottom: 24px;
  text-align: center;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 36px 32px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 8px 32px rgba(26, 58, 92, 0.1);
}

/* Alert */
.alert-error {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  margin-bottom: 20px;
}

/* Loading */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 0;
  gap: 14px;
}
.spinner {
  width: 40px;
  height: 40px;
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
.loading-overlay p {
  color: #6b7280;
  font-size: 14px;
}

/* Form */
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 14px;
  color: #9ca3af;
  pointer-events: none;
}
.input-wrapper input {
  width: 100%;
  padding: 13px 40px 13px 44px;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  color: #1f2937;
  background: #f9fafb;
  transition: all 0.2s;
  outline: none;
}
.input-wrapper input::placeholder {
  color: #9ca3af;
}
.input-wrapper input:focus {
  border-color: #2563eb;
  background: white;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}
.input-wrapper input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-password {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;
}
.toggle-password:hover {
  color: #6b7280;
}

.forgot-link-row {
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
  margin-bottom: 20px;
}
.forgot-link {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}
.forgot-link:hover {
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: #e07b2a;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;
}
.btn-primary:hover:not(:disabled) {
  background: #c96a1e;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(224, 123, 42, 0.35);
}
.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}
.btn-primary:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 18px;
  font-size: 14px;
  color: #6b7280;
}
.register-link a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
.register-link a:hover {
  text-decoration: underline;
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 22px 0;
}
.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}
.divider span {
  position: relative;
  background: white;
  padding: 0 14px;
  color: #9ca3af;
  font-size: 13px;
}

/* Social Buttons */
.social-buttons {
  display: flex;
  justify-content: center;
  gap: 14px;
}
.btn-social {
  width: 56px;
  height: 56px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-social:hover:not(:disabled) {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.btn-facebook {
  background: #1877f2;
  border-color: #1877f2;
}
.btn-facebook:hover:not(:disabled) {
  background: #166fe5;
  border-color: #166fe5;
}
.btn-social:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

@media (max-width: 480px) {
  .login-card {
    padding: 28px 20px;
  }
  .login-title {
    font-size: 22px;
  }
  .hero-banner {
    height: 220px;
  }
}
</style>

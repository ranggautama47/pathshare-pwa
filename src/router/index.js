/**
 * PathShare - Phase 1
 * Vue Router Configuration
 *
 * Routes:
 * - / (Home) - List of stories
 * - /story/:id (Detail) - Story detail
 */

import { createRouter, createWebHistory } from "vue-router";
import Swal from "sweetalert2";
import HomeView from "@/views/HomeView.vue";
import DetailView from "@/views/DetailView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";

// ============================================================================
// ROUTES
// ============================================================================

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      title: "Login",
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
    meta: { title: "Register", requiresAuth: false },
  },
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: {
      title: "Stories",
      requiresAuth: true,
    },
  },
  {
    path: "/story/:id",
    name: "StoryDetail",
    component: DetailView,
    props: true,
    meta: {
      title: "Story Details",
      requiresAuth: true,
    },
  },
  {
    path: "/create-story",
    name: "CreateStory",
    component: () => import("@/views/CreateStoryView.vue"),
    meta: {
      title: "Buat Laporan Baru",
      requiresAuth: true, // Wajib login untuk membuat cerita/laporan
    },
  },
  {
    path: "/laporan",
    name: "Laporan",
    component: () => import("@/views/LaporanView.vue"),
    meta: {
      title: "Daftar Laporan",
      requiresAuth: true, // Laporan hanya bisa dilihat oleh user login
    },
  },
  {
    path: "/cara-kerja",
    name: "CaraKerja",
    component: () => import("@/views/CaraKerjaView.vue"),
    meta: { title: "Cara Kerja", requiresAuth: false },
  },
  {
    path: "/blog",
    name: "blog",
    component: () => import("../views/BlogView.vue"),
    meta: { title: "Blog", requiresAuth: false },
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("../views/FAQView.vue"),
    meta: { title: "FAQ", requiresAuth: false },
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../views/ContactView.vue"),
    meta: { title: "Kontak", requiresAuth: false },
  },
  {
    // Catch-all for 404
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundView,
    meta: {
      title: "Page Not Found",
      requiresAuth: false,
    },
  },
];

// ============================================================================
// ROUTER INSTANCE
// ============================================================================

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// ============================================================================
// GLOBAL NAVIGATION GUARD (DIPERBAIKI)
// ============================================================================

router.beforeEach((to, from, next) => {
  // 1. Update Title
  document.title = `${to.meta.title || "PathShare"} - PathShare`;

  // 2. Cek Token
  const stored = localStorage.getItem("pathshare_auth");
  let isAuthenticated = false;

  try {
    if (stored) {
      const { user, googleToken } = JSON.parse(stored);
      isAuthenticated = !!user && !!googleToken;
    }
  } catch (e) {
    isAuthenticated = false;
  }

  // 3. Logika Pengalihan dengan Notifikasi
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Tampilkan SweetAlert sebelum melempar ke Login
    Swal.fire({
      icon: "warning",
      title: "Akses Terbatas",
      text: "Sesi Anda tidak ditemukan. Silakan login terlebih dahulu.",
      confirmButtonColor: "#e07b2a", // Warna oranye khas PathShare
      confirmButtonText: "Ke Halaman Login",
      timer: 3500,
      timerProgressBar: true,
    }).then(() => {
      next({ name: "Login" });
    });
  } else if (
    isAuthenticated &&
    (to.name === "Login" || to.name === "Register")
  ) {
    // Opsional: Beritahu user kalau mereka sudah login
    Swal.fire({
      icon: "info",
      title: "Sudah Login",
      text: "Anda sudah masuk ke akun Anda.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;

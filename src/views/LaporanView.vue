<template>
  <div class="laporan-page">
    <!-- =========================================
         HEADER
    ========================================= -->
    <div class="page-header">
      <div class="page-header-inner">
        <h1>Laporan Pengaduan</h1>
      </div>
    </div>

    <!-- =========================================
         FILTER BAR — sesuai mockup
    ========================================= -->
    <div class="filter-wrapper">
      <div class="filter-bar">
        <!-- Kabupaten/Kota -->
        <div class="filter-select-wrap">
          <select v-model="filterKota" class="filter-select">
            <option value="">Kabupaten/Kota</option>
            <option>Jakarta</option>
            <option>Bandung</option>
            <option>Surabaya</option>
            <option>Depok</option>
            <option>Bogor</option>
          </select>
          <svg
            class="select-arrow"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <!-- Status Laporan -->
        <div class="filter-select-wrap">
          <select v-model="filterStatus" class="filter-select">
            <option value="">Status Laporan</option>
            <option>Menunggu Tindakan</option>
            <option>Dalam Proses</option>
            <option>Sedang Diperbaiki</option>
            <option>Selesai</option>
          </select>
          <svg
            class="select-arrow"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <!-- Search -->
        <div class="search-wrap">
          <svg
            class="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            class="search-input"
            type="text"
            placeholder="Cari mess na tiqy10"
          />
        </div>

        <!-- Filter Button -->
        <button class="btn-filter">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filter
        </button>
      </div>
    </div>

    <!-- =========================================
         TABLE LAPORAN — sesuai mockup
    ========================================= -->
    <div class="table-wrapper">
      <!-- Loading -->
      <div v-if="isLoading" class="state-box">
        <div class="spinner"></div>
        <p>Memuat data laporan...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state-box error">
        <svg
          width="40"
          height="40"
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
        <button class="btn-retry" @click="fetchStories">Coba Lagi</button>
      </div>

      <!-- Table -->
      <table v-else class="laporan-table">
        <thead>
          <tr>
            <th class="col-laporan">
              <span>↑ Laporan</span>
            </th>
            <th class="col-lokasi">
              Lokasi
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </th>
            <th class="col-status">
              Status
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </th>
            <th class="col-aksi">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredStories.length === 0">
            <td colspan="4" class="empty-row">
              <div class="empty-state">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d1d5db"
                  stroke-width="1.2"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <p>Belum ada laporan yang ditemukan.</p>
              </div>
            </td>
          </tr>
          <tr
            v-for="story in paginatedStories"
            :key="story.id"
            class="table-row"
          >
            <!-- Kolom Laporan: thumbnail + nama + lokasi kecil -->
            <td class="cell-laporan">
              <div class="laporan-cell">
                <img
                  :src="story.photoUrl"
                  :alt="story.name"
                  class="thumb"
                  loading="lazy"
                />
                <div class="laporan-cell-info">
                  <p class="laporan-name">{{ story.name }}</p>
                  <p class="laporan-sub">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9ca3af"
                      stroke-width="2"
                    >
                      <path
                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                      />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {{ story.description?.substring(0, 22) }}...
                  </p>
                </div>
              </div>
            </td>

            <!-- Kolom Lokasi -->
            <td class="cell-lokasi">
              <p class="lokasi-kota">{{ getKota(story) }}</p>
              <p class="lokasi-prov">{{ getProv(story) }}</p>
            </td>

            <!-- Kolom Status -->
            <td class="cell-status">
              <span :class="['badge', getStatusClass(story)]">
                {{ getStatusLabel(story) }}
              </span>
            </td>

            <!-- Kolom Aksi -->
            <td class="cell-aksi">
              <RouterLink :to="`/story/${story.id}`" class="btn-detail">
                Lihat Detail
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        v-if="!isLoading && !error && filteredStories.length > 0"
        class="pagination"
      >
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          &laquo;
        </button>

        <button
          v-for="p in totalPages"
          :key="p"
          :class="['page-btn', { active: currentPage === p }]"
          @click="currentPage = p"
        >
          {{ p }}
        </button>

        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          &raquo;
        </button>

        <span class="page-info">{{ filteredStories.length }} laporan</span>
      </div>
    </div>

    <!-- =========================================
         FOOTER BANNER "Belum Melaporkan?"
         Sesuai mockup — bagian bawah halaman laporan
    ========================================= -->
    <section class="footer-banner">
      <div class="footer-banner-inner">
        <!-- KIRI -->
        <div class="footer-banner-text">
          <h2>Belum Melaporkan?</h2>
          <p>
            Bantu banyak orang dengan melaporkan kondisi jalan rusak di
            sekitarmu kepada pihak berwajib.
          </p>

          <button class="btn-orange" @click="goToCreate">
            Laporkan Jalan Rusak
          </button>
        </div>

        <!-- KANAN (gambar) -->
        <div class="footer-banner-image"></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import API_ENDPOINT from "@/api-endpoint";

const router = useRouter();

// ============================================================
// STATE
// ============================================================
const stories = ref([]);
const isLoading = ref(true);
const error = ref(null);
const filterKota = ref("");
const filterStatus = ref("");
const searchQuery = ref("");
const currentPage = ref(1);
const perPage = 5;

// ============================================================
// HELPERS
// ============================================================
const statusPool = [
  "Menunggu Tindakan",
  "Dalam Proses",
  "Sedang Diperbaiki",
  "Selesai",
];
const kotaPool = [
  "Jakarta Selatan",
  "Bandung",
  "Surabaya",
  "Depok",
  "Bogor",
  "Bekasi",
  "Tangerang",
];
const provPool = ["Jakarta Selatan", "Bandung", "Sontoa", "Depok", "Bandiga"];

const getStatusLabel = (story) =>
  statusPool[story.id?.charCodeAt(0) % statusPool.length] ??
  "Menunggu Tindakan";
const getKota = (story) =>
  kotaPool[story.id?.charCodeAt(1) % kotaPool.length] ?? "Jakarta";
const getProv = (story) =>
  provPool[story.id?.charCodeAt(2) % provPool.length] ?? "";

const getStatusClass = (story) => {
  const s = getStatusLabel(story);
  if (s === "Menunggu Tindakan") return "badge-orange";
  if (s === "Dalam Proses") return "badge-green";
  if (s === "Sedang Diperbaiki") return "badge-blue";
  return "badge-gray";
};

// ============================================================
// FILTER + PAGINATION
// ============================================================
const filteredStories = computed(() => {
  return stories.value.filter((s) => {
    const matchSearch =
      !searchQuery.value ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus =
      !filterStatus.value || getStatusLabel(s) === filterStatus.value;
    const matchKota = !filterKota.value || getKota(s) === filterKota.value;
    return matchSearch && matchStatus && matchKota;
  });
});

const totalPages = computed(
  () => Math.ceil(filteredStories.value.length / perPage) || 1,
);

const paginatedStories = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredStories.value.slice(start, start + perPage);
});

// ============================================================
// FETCH
// ============================================================
const fetchStories = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const authData = JSON.parse(localStorage.getItem("pathshare_auth") || "{}");
    const token = authData.googleToken || authData.token;

    const response = await fetch(`${API_ENDPOINT.BASE_URL}/stories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    stories.value = result.listStory;
  } catch (err) {
    error.value = "Gagal memuat laporan. Pastikan Anda sudah login.";
  } finally {
    isLoading.value = false;
  }
};

const goToCreate = () => {
  const auth = localStorage.getItem("pathshare_auth");
  router.push(auth ? "/create-story" : "/login");
};

onMounted(() => fetchStories());
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.laporan-page {
  font-family:
    "Segoe UI",
    system-ui,
    -apple-system,
    sans-serif;
  background: #f0f2f5;
  min-height: 100vh;
}

/* ============================
   PAGE HEADER
============================ */
.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 28px 0 20px;
}
.page-header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}
.page-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: #1a3a5c;
}

/* ============================
   FILTER BAR
============================ */
.filter-wrapper {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
}

.filter-bar {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.filter-select {
  appearance: none;
  padding: 9px 36px 9px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  background: white;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.filter-select:focus {
  border-color: #2563eb;
}
.select-arrow {
  position: absolute;
  right: 10px;
  color: #9ca3af;
  pointer-events: none;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 180px;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: #2563eb;
}

.btn-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-filter:hover {
  border-color: #1a3a5c;
  color: #1a3a5c;
}

/* ============================
   TABLE WRAPPER
============================ */
.table-wrapper {
  max-width: 1100px;
  margin: 24px auto;
  padding: 0 24px;
}

/* Loading / Error States */
.state-box {
  background: white;
  border-radius: 14px;
  padding: 60px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: #6b7280;
  font-size: 15px;
}
.state-box.error {
  color: #e07b2a;
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

.btn-retry {
  background: #e07b2a;
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* Table */
.laporan-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(26, 58, 92, 0.07);
}

thead tr {
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}
thead th {
  padding: 14px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-align: left;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #e5e7eb;
}
thead th svg {
  vertical-align: middle;
  margin-left: 4px;
}

.col-laporan {
  width: 38%;
}
.col-lokasi {
  width: 22%;
}
.col-status {
  width: 22%;
}
.col-aksi {
  width: 18%;
}

/* Body Rows */
.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
  cursor: pointer;
}
.table-row:last-child {
  border-bottom: none;
}
.table-row:hover {
  background: #f8fafc;
}

/* Laporan cell */
.cell-laporan {
  padding: 14px 16px;
}
.laporan-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}
.thumb {
  width: 64px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  background: #e5e7eb;
}
.laporan-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a3a5c;
  margin-bottom: 4px;
  line-height: 1.3;
}
.laporan-sub {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

/* Lokasi cell */
.cell-lokasi {
  padding: 14px 16px;
}
.lokasi-kota {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 3px;
}
.lokasi-prov {
  font-size: 12px;
  color: #9ca3af;
}

/* Status cell */
.cell-status {
  padding: 14px 16px;
}
.badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-orange {
  background: #fff3e0;
  color: #e07b2a;
}
.badge-green {
  background: #e8f5e9;
  color: #2e7d32;
}
.badge-blue {
  background: #e3f2fd;
  color: #1565c0;
}
.badge-gray {
  background: #f3f4f6;
  color: #6b7280;
}

/* Aksi cell */
.cell-aksi {
  padding: 14px 16px;
}
.btn-detail {
  display: inline-block;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}
.btn-detail:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Empty */
.empty-row {
  padding: 0;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 60px 24px;
  color: #9ca3af;
  font-size: 15px;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  flex-wrap: wrap;
}
.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn:hover:not(:disabled):not(.active) {
  border-color: #1a3a5c;
  color: #1a3a5c;
}
.page-btn.active {
  background: #1a3a5c;
  border-color: #1a3a5c;
  color: white;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.page-info {
  font-size: 12px;
  color: #9ca3af;
  margin-left: 8px;
}

/* ============================
   FOOTER BANNER "Belum Melaporkan?"
============================ */
.footer-banner {
  background: #1a3a5c;
  padding: 60px 24px;
  margin-top: 48px;
  position: relative;
  overflow: hidden;
}

.footer-banner-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
  z-index: 2;
}

.footer-banner-text {
  max-width: 480px;
}

.footer-banner-text h2 {
  font-size: 28px;
  font-weight: 800;
  color: white;
  margin-bottom: 12px;
}

.footer-banner-text p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 20px;
  line-height: 1.6;
}

.footer-banner-image {
  flex: 1;
  height: 360px;
  background: url("/asset/footer-laporan.png") no-repeat center;
  background-size: contain;
}

.footer-banner::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 120px 120px;
  z-index: 1;
}
.btn-orange {
  background: #e07b2a;
  color: white;
  border: none;
  padding: 13px 26px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(224, 123, 42, 0.38);
}
.btn-orange:hover {
  background: #c96a1e;
  transform: translateY(-1px);
}

/* ============================
   RESPONSIVE
============================ */
@media (max-width: 768px) {
  .laporan-table,
  .laporan-table thead,
  .laporan-table tbody,
  .laporan-table th,
  .laporan-table td,
  .laporan-table tr {
    display: block;
  }
  thead tr {
    display: none;
  }
  .table-row {
    background: white;
    border-radius: 12px;
    margin-bottom: 12px;
    border: 1px solid #e5e7eb;
    padding: 14px;
  }
  .cell-laporan,
  .cell-lokasi,
  .cell-status,
  .cell-aksi {
    padding: 6px 0;
    border: none;
  }
  .footer-banner-inner {
    flex-direction: column;
    text-align: center;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-wrap {
    min-width: 100%;
  }
}
</style>

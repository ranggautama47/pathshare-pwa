<template>
  <div class="create-story-page">
    <div class="container">
      <div class="page-header">
        <h1>Laporkan Jalan Rusak</h1>
        <p>
          Bantu perbaiki infrastruktur dengan melaporkan kerusakan di sekitarmu.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="report-form">
        <div class="form-grid">
          <div class="form-section">
            <h3>📍 Tandai Lokasi</h3>
            <p class="section-desc">
              Pilih lokasi jalan rusak di peta atau gunakan fitur deteksi
              otomatis.
            </p>

            <div id="map" class="map-container"></div>

            <div class="location-actions">
              <button
                type="button"
                @click="detectLocation"
                class="btn-secondary"
                :disabled="isDetectingLocation"
              >
                {{
                  isDetectingLocation
                    ? "Mendeteksi..."
                    : "🎯 Gunakan Lokasi Saat Ini"
                }}
              </button>

              <div v-if="lat !== null && lon !== null" class="coords-info">
                <span><strong>Lat:</strong> {{ lat.toFixed(5) }}</span>
                <span><strong>Lon:</strong> {{ lon.toFixed(5) }}</span>
              </div>
            </div>

            <div v-if="lat !== null" class="address-box">
              <span class="address-label">📍 Lokasi Terpilih:</span>
              <p v-if="isFetchingAddress" class="address-loading">
                Mencari alamat...
              </p>
              <p v-else class="address-text">
                {{ locationName || "Alamat tidak ditemukan" }}
              </p>
            </div>
          </div>

          <div class="form-section">
            <h3>📝 Detail Pengaduan</h3>

            <div class="form-group">
              <label>Foto Kerusakan <span class="required">*</span></label>
              <div
                class="image-upload-wrapper"
                @click="triggerFileInput"
                @dragover.prevent
                @dragenter.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                :class="{ 'has-image': photoPreview, dragging: isDragging }"
              >
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  accept="image/*"
                  class="hidden-input"
                />

                <div v-if="photoPreview" class="preview-container">
                  <img
                    :src="photoPreview"
                    alt="Preview"
                    class="image-preview"
                  />
                  <div class="change-photo-overlay">
                    Ganti atau Drag Foto Baru
                  </div>
                </div>

                <div v-else class="upload-placeholder">
                  <span class="icon">📷</span>
                  <span class="main-text"
                    >Klik atau drag & drop foto jalan rusak</span
                  >
                  <span class="sub-text">Format: JPG, PNG, WEBP</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Deskripsi Kerusakan <span class="required">*</span></label>
              <textarea
                v-model="description"
                rows="5"
                placeholder="Contoh: Lubang dalam di tengah jalan, sangat berbahaya saat hujan turun..."
              ></textarea>
            </div>

            <button type="submit" class="btn-primary" :disabled="isLoading">
              {{ isLoading ? "Sedang Mengirim..." : "Kirim Laporan Sekarang" }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import L from "leaflet";
import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const router = useRouter();

// State Form
const fileInput = ref(null);
const description = ref("");
const photo = ref(null);
const photoPreview = ref(null);
const lat = ref(null);
const lon = ref(null);
const locationName = ref(""); // State untuk nama alamat

// State UI
const isLoading = ref(false);
const isDetectingLocation = ref(false);
const isDragging = ref(false);
const isFetchingAddress = ref(false); // State loading alamat

// State Map
let mapInstance = null;
let markerInstance = null;

onMounted(() => {
  mapInstance = L.map("map").setView([-2.5489, 118.0148], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(mapInstance);

  mapInstance.on("click", (e) => {
    const { lat: clickedLat, lng: clickedLng } = e.latlng;
    updateMarker(clickedLat, clickedLng);
  });
});

const updateMarker = (latitude, longitude) => {
  lat.value = latitude;
  lon.value = longitude;

  if (markerInstance) {
    markerInstance.setLatLng([latitude, longitude]);
  } else {
    markerInstance = L.marker([latitude, longitude]).addTo(mapInstance);
  }
  mapInstance.flyTo([latitude, longitude], 15);

  // Panggil fungsi pencarian alamat
  fetchAddress(latitude, longitude);
};

// --- REVERSE GEOCODING LOGIC ---
const fetchAddress = async (latitude, longitude) => {
  isFetchingAddress.value = true;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    );
    const data = await response.json();
    locationName.value = data.display_name;
  } catch (error) {
    locationName.value = "Gagal mengambil nama lokasi";
  } finally {
    isFetchingAddress.value = false;
  }
};

// --- DRAG & DROP LOGIC ---
const handleDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    processImage(file);
  } else {
    Swal.fire({
      icon: "error",
      title: "Bukan Gambar!",
      text: "Harap upload file gambar.",
    });
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) processImage(file);
};

const processImage = (file) => {
  photo.value = file;
  photoPreview.value = URL.createObjectURL(file);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

// --- LOCATION LOGIC ---
const detectLocation = () => {
  if (!navigator.geolocation) {
    Swal.fire("Error", "Browser Anda tidak mendukung deteksi lokasi.", "error");
    return;
  }

  isDetectingLocation.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      updateMarker(position.coords.latitude, position.coords.longitude);
      isDetectingLocation.value = false;
    },
    () => {
      Swal.fire(
        "Gagal Lokasi",
        "Pastikan GPS aktif dan izin lokasi diberikan.",
        "warning",
      );
      isDetectingLocation.value = false;
    },
  );
};

const getToken = () => {
  try {
    const storedAuth = localStorage.getItem("pathshare_auth");
    const parsed = JSON.parse(storedAuth);
    return parsed.googleToken || parsed.token || null;
  } catch {
    return null;
  }
};

// --- SUBMIT LOGIC ---
const handleSubmit = async () => {
  // --- VALIDASI KETAT ---

  // 1. Validasi Foto
  if (!photo.value) {
    return Swal.fire({
      icon: "warning",
      title: "Foto Wajib Diisi",
      text: "Mohon unggah foto jalan yang rusak sebelum mengirim.",
    });
  }

  // 2. Validasi Lokasi (Lat & Lon)
  if (lat.value === null || lon.value === null) {
    return Swal.fire({
      icon: "error",
      title: "Lokasi Belum Ditandai",
      text: "Mohon klik pada peta atau gunakan fitur deteksi lokasi untuk menandai posisi jalan rusak.",
    });
  }

  // 3. Validasi Deskripsi
  if (!description.value.trim()) {
    return Swal.fire({
      icon: "warning",
      title: "Deskripsi Kosong",
      text: "Mohon jelaskan kondisi jalan yang rusak.",
    });
  }

  // Tampilkan Loading
  Swal.fire({
    title: "Sedang Mengirim Laporan...",
    text: "Mohon tunggu sebentar",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  isLoading.value = true;

  try {
    const token = getToken();
    if (!token) throw new Error("Sesi login berakhir. Silakan login kembali.");

    const formData = new FormData();
    formData.append("description", description.value);
    formData.append("photo", photo.value);
    formData.append("lat", lat.value);
    formData.append("lon", lon.value);

    const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Gagal mengirim laporan.");

    Swal.fire({
      icon: "success",
      title: "Laporan Terkirim!",
      text: "Terima kasih telah berkontribusi!",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      router.push("/");
    });
  } catch (err) {
    Swal.fire({ icon: "error", title: "Terjadi Kesalahan", text: err.message });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* CSS ASLI KAMU TETAP SAMA */
.create-story-page {
  padding: 40px 20px;
  background-color: #f8fafc;
  min-height: calc(100vh - 70px);
}
.container {
  max-width: 1000px;
  margin: 0 auto;
}
.page-header {
  text-align: center;
  margin-bottom: 30px;
}
.page-header h1 {
  color: #1a3a5c;
  font-size: 28px;
  margin-bottom: 8px;
}
.page-header p {
  color: #64748b;
}
.report-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 30px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}
.form-section h3 {
  color: #1a3a5c;
  font-size: 18px;
  margin-bottom: 8px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 10px;
}
.section-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 15px;
}
.map-container {
  height: 350px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  margin-bottom: 15px;
  z-index: 1;
}
.location-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;
}
.coords-info {
  font-size: 11px;
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 6px;
  color: #475569;
  display: flex;
  flex-direction: column;
}

/* CSS BARU UNTUK ALAMAT */
.address-box {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  padding: 12px;
  border-radius: 8px;
  margin-top: 5px;
}
.address-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #c2410c;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.address-text {
  font-size: 13px;
  color: #431407;
  line-height: 1.4;
  margin: 0;
}
.address-loading {
  font-size: 13px;
  color: #e07b2a;
  font-style: italic;
  margin: 0;
}

/* SISA CSS ASLI KAMU */
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  font-size: 14px;
}
.required {
  color: #ef4444;
}
.hidden-input {
  display: none;
}
.image-upload-wrapper {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #f8fafc;
  transition: all 0.2s;
  overflow: hidden;
  position: relative;
}
.image-upload-wrapper.dragging {
  border-color: #1a3a5c;
  background: #e2e8f0;
  transform: scale(1.01);
}
.image-upload-wrapper:hover {
  border-color: #1a3a5c;
  background: #f1f5f9;
}
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #64748b;
  text-align: center;
  padding: 20px;
}
.upload-placeholder .icon {
  font-size: 40px;
  margin-bottom: 10px;
}
.preview-container {
  width: 100%;
  height: 100%;
}
.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.change-photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 58, 92, 0.85);
  color: white;
  text-align: center;
  padding: 10px 0;
  font-size: 12px;
  transform: translateY(100%);
  transition: transform 0.3s;
}
.image-upload-wrapper:hover .change-photo-overlay {
  transform: translateY(0);
}
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: none;
}
.btn-primary {
  width: 100%;
  background: #e07b2a;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 10px;
}
.btn-primary:hover:not(:disabled) {
  background: #cc6a21;
}
.btn-secondary {
  background: white;
  color: #1a3a5c;
  border: 1px solid #1a3a5c;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>

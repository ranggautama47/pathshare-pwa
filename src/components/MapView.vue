<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>

    <button @click="showMyLocation" class="btn-location" :disabled="isLocating">
      <svg
        v-if="!isLocating"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <span v-if="isLocating" class="spinner"></span>
      {{ isLocating ? "Mencari lokasi..." : "Show My Location" }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Props dari DetailView
const props = defineProps({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  title: { type: String, default: "Lokasi Story" },
  image: { type: String, default: "" },
});

const mapContainer = ref(null);
let map = null;
let userMarker = null;
const isLocating = ref(false);

// Fix: Isu path marker default Leaflet saat dibuild menggunakan Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url,
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

onMounted(() => {
  initMap();
});

const initMap = () => {
  // Inisialisasi peta
  map = L.map(mapContainer.value).setView([props.lat, props.lon], 14);

  // Layer OpenStreetMap (Bisa diakses offline jika di-cache oleh Service Worker)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  }).addTo(map);

  // Marker Story dari API
  const storyMarker = L.marker([props.lat, props.lon]).addTo(map);

  // Custom Popup dengan gaya minimalis
  const popupContent = `
    <div class="custom-popup">
      ${props.image ? `<div class="popup-img-wrapper"><img src="${props.image}" alt="Story Image" /></div>` : ""}
      <h4 class="popup-title">${props.title}</h4>
    </div>
  `;
  storyMarker.bindPopup(popupContent);
};

const showMyLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolokasi tidak didukung oleh browser Anda.");
    return;
  }

  isLocating.value = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Hapus marker user sebelumnya jika ada
      if (userMarker) {
        map.removeLayer(userMarker);
      }

      // Buat custom marker geometric untuk user (titik biru)
      const userIcon = L.divIcon({
        className: "user-marker-icon",
        html: '<div class="dot-inner"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(
        map,
      );
      userMarker.bindPopup("<b>Lokasi Anda</b>").openPopup();

      // Sesuaikan zoom agar story & user terlihat dalam satu frame
      const group = new L.featureGroup([
        L.marker([props.lat, props.lon]),
        userMarker,
      ]);
      map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 15 });

      isLocating.value = false;
    },
    (error) => {
      console.error("Error geolocation:", error);
      alert("Gagal mendapatkan lokasi. Pastikan izin GPS diberikan.");
      isLocating.value = false;
    },
    { enableHighAccuracy: true },
  );
};

// Cleanup instance map saat berpindah halaman agar tidak memory leak
onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  margin-top: 24px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa; /* Fallback saat offline/loading */
}

.map-container {
  height: 400px;
  width: 100%;
  z-index: 1; /* Pastikan di bawah komponen UI Vue lainnya */
}

/* Minimalist Button Styling */
.btn-location {
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 1000; /* Leaflet map z-index is 400 */
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #ffffff;
  color: #111111;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.btn-location:hover:not(:disabled) {
  background-color: #f9f9f9;
  border-color: #d0d0d0;
}

.btn-location:disabled {
  opacity: 0.7;
  cursor: wait;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #e5e5e5;
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Override Leaflet Popup Styles (Injecting ke global agar terbaca Leaflet) */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

:deep(.leaflet-popup-content) {
  margin: 0;
  width: 200px !important;
}

:deep(.custom-popup .popup-img-wrapper) {
  width: 100%;
  height: 120px;
  overflow: hidden;
}

:deep(.custom-popup img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.custom-popup .popup-title) {
  margin: 0;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #111;
  text-align: center;
}

/* User Geometric Marker */
:deep(.user-marker-icon) {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 102, 204, 0.2);
  border-radius: 50%;
  border: 1px solid rgba(0, 102, 204, 0.4);
}

:deep(.dot-inner) {
  width: 10px;
  height: 10px;
  background: #0066cc;
  border-radius: 50%;
  box-shadow: 0 0 0 2px white;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .map-container {
    height: 300px;
  }
  .btn-location {
    bottom: 16px;
    right: 16px;
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>

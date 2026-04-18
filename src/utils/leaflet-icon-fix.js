// ============================================================
// src/utils/leaflet-icon-fix.js
//
// Leaflet marker icon fix untuk Vite build.
// Import dan panggil fixLeafletIcon() SEBELUM L.map() dibuat.
//
// Kenapa ini perlu:
//   Leaflet secara default cari marker icon di path internal
//   node_modules/leaflet/dist/images/ yang TIDAK dikopi ke build.
//   Vite tidak tahu path itu perlu di-bundle kecuali kita import
//   eksplisit. Tanpa fix ini:
//   - Local dev: marker muncul (karena Vite dev server serve semua file)
//   - After build + deploy: marker hilang / broken (404 atau SW return HTML)
// ============================================================

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/**
 * Fix Leaflet default marker icon path untuk Vite build.
 * Panggil sekali sebelum L.map() atau L.marker() pertama dibuat.
 */
export function fixLeafletIcon() {
  // Hapus internal resolver bawaan Leaflet
  delete L.Icon.Default.prototype._getIconUrl;

  // Set path ke file yang sudah di-bundle Vite (dapat hash di nama)
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}

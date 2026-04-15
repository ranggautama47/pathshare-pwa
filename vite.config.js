import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, 
        type: 'module'
      },
      manifest: {
        name: "PathShare",
        short_name: "PathShare",
        description: "Share stories with locations",
        theme_color: "#0066cc",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      // ✅ PHASE 3 (CUSTOM SW)
      strategies: "injectManifest",
      srcDir: "src/sw",
      filename: "custom-sw.js",

      injectManifest: {
        globPatterns: ["**/*.{js,css,html,png,svg}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});

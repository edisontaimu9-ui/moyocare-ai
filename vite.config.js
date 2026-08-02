import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// base: "./" keeps every asset/manifest/icon path relative, so this works
// whether it's served from a domain root, a GitHub Pages project subpath
// (e.g. /moyocare-ai/), or a custom domain.
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/apple-touch-icon.png"],
      manifest: {
        name: "MoyoCare AI",
        short_name: "MoyoCare AI",
        description:
          "AI-assisted clinical nutrition and health companion, built on the Chakudya Nutrition Registry.",
        start_url: ".",
        scope: ".",
        display: "standalone",
        orientation: "portrait",
        background_color: "#F6F1E7",
        theme_color: "#0F5C4C",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Cache the app shell so it opens instantly and works offline once
        // installed. Live data calls (Chakudya API etc.) are not cached
        // here — add runtimeCaching entries later once endpoints exist.
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
    }),
  ],
});

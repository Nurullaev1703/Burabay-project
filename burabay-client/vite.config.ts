import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true, // Включает PWA в режиме разработки
      },
      manifest: {
        name: "Burabay Travel",
        short_name: "Burabay Travel",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/burabay-client/public/logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/burabay-client/public/logo-192x192.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "image" ||
              request.destination === "script" ||
              request.destination === "style",
            handler: "CacheFirst",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
              },
            },
          },
        ],
      },
    }),
  ],
});

import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base:"/",
  plugins: [react(), TanStackRouterVite()],
  server: {
    host: true,
    port: 80,
    open: true,
    hmr: true,
    proxy: {
      "/api": "http://91.215.139.89:3000", // Прокси для API-запросов
    },
  },
});

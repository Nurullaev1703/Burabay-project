import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), TanStackRouterVite()],
    server: {
        host: true,
        port: 5173,
        open: true,
        hmr: true,
        proxy: {
            "/api": "http://burabay-damu.kz/api", // Прокси для API-запросов
        },
    },
});

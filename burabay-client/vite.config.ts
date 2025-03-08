import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), TanStackRouterVite()],
    server: {
        host: true,
        port: 5174,
        open: true,
        hmr: true,
        cors: true,
        allowedHosts: ["test.burabay-damu.kz"],
        proxy: {
            "/api": "https://test.burabay-damu.kz/back", // Прокси для API-запросов
        },
    },
    preview: {
        port: 80,
    },
});

import { defineConfig } from "vite";

export default defineConfig({
    base: "/piedra-papel-tijera/",

    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
}); 
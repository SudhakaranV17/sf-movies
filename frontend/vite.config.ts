import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      tailwindcss(),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        generatedRouteTree: "./routeTree.gen.ts",
      }),
      react(),
    ] as PluginOption[],
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@shared": path.resolve(__dirname, "./src/shared"),
        "@modules": path.resolve(__dirname, "./src/modules"),
      },
    },
    server: {
      port:8000,
       host: "0.0.0.0",
      allowedHosts: ["*"],
      proxy: {
        "/api": {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: function (path: string) {
            return path.replace(/^\/api/, "");
          },
          secure: false,
        },
      },
    },
  };
});

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import path from "path";

export default defineConfig({
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
});

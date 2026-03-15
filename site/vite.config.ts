import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

export default defineConfig({
  root: __dirname,
  publicDir: path.resolve(repoRoot, "public"),
  server: {
    port: 5174,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 150,
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@/": path.resolve(repoRoot, "src") + "/",
      "~": repoRoot,
      "@site/": path.resolve(__dirname, "src") + "/",
    },
  },
});

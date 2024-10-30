import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  // plugins: [vue(), cssInjectedByJsPlugin()],
  plugins: [vue()],
  resolve: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
      "~": new URL("./", import.meta.url).pathname,
    },
  },

  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  build: {
    cssCodeSplit: true,
    target: "esnext",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Drocket",
      fileName: (format) => `drocket.${format}.js`,
    },

    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});

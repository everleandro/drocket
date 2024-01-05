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
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./public/styles/setting.scss";
        `,
      },
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

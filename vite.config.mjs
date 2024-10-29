import { defineConfig } from "npm:vite";
import vue from "npm:@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: "./src/main.js",
    },
    outDir: "build",
    manifest: "manifest.json",
  },
});

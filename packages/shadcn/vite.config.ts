/**
 * @type {import('vite').UserConfig}
 */
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  build: {
    rollupOptions: {
      external: ["react", "react-dom"],
      input: ["/src/components/index.tsx"],
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "index.css"
      }
    }
  }
});

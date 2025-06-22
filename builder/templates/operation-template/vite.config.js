import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist"
  },
  server: {
    port: 3003
  },
  resolve: {
    dedupe: ["react", "react-dom", "@go-blite/design", "@go-blite/selectors"]
  }
});

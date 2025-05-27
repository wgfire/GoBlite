import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000, // You can change this port if needed
    open: true // Automatically open the app in the browser on server start
  },
  build: {
    outDir: "dist" // Output directory for the build
  }
});

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH,
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks: {
            design: ["@go-blite/design"],
            shadcn: ["@go-blite/shadcn"],
            "react-vendor": ["react", "react-dom"],
            vendor: ["ahooks", "lodash-es", "use-immer"]
          },
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]"
        }
      },
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    optimizeDeps: {
      include: ["react", "react-dom", "ahooks", "lodash-es", "use-immer"]
    }
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    cssMinify: "esbuild",

    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "@go-blite/events", "@go-blite/shadcn", "loadsh-es"],
      treeshake: true,
      preserveEntrySignatures: "strict",
      input: ["src/index.ts"],
      output: [
        {
          dir: "dist/esm",
          format: "esm",
          sourcemap: false,
          chunkFileNames: "vendor/[name].js",
          assetFileNames: "style/[name].[ext]",
          preserveModules: true, // 保持原始的模块结构
          preserveModulesRoot: "src" // 设置相对路径起点
        },
        {
          dir: "dist/lib",
          format: "cjs",
          sourcemap: false,
          chunkFileNames: "vendor/[name].js",
          assetFileNames: "style/[name].[ext]",
          preserveModules: true,
          preserveModulesRoot: "src"
        }
      ]
    }
  }
});

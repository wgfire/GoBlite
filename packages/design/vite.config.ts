import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dts from "vite-plugin-dts";
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts", "src/**/*.tsx"],
      outDir: ["dist/esm", "dist/lib"],
      rollupTypes: true,
      copyDtsFiles: true
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    cssMinify: "esbuild",

    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@go-blite/events",
        "@go-blite/shadcn",
        "loadsh-es",
        "use-immer",
        "clsx"
      ],
      treeshake: true,
      preserveEntrySignatures: "strict",
      input: ["src/index.ts", "src/styles/tailwind.css"],
      output: [
        {
          dir: "dist/esm",
          format: "esm",
          sourcemap: false,
          entryFileNames: "[name].js",
          chunkFileNames: "vendor/[name].js",
          assetFileNames: "styles/[name].[ext]",
          preserveModules: true, // 保持原始的模块结构
          preserveModulesRoot: "src" // 设置相对路径起点
        },
        {
          dir: "dist/lib",
          format: "cjs",
          sourcemap: false,
          entryFileNames: "[name].js",
          chunkFileNames: "vendor/[name].js",
          assetFileNames: "styles/[name].[ext]",
          preserveModules: true,
          preserveModulesRoot: "src"
        }
      ]
    }
  }
});

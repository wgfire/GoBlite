import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dts from "vite-plugin-dts";
export default defineConfig(({ mode }) => {
  console.log(mode, "design构建信息");
  loadEnv(mode, path.resolve(__dirname, "./"), "");
  return {
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
      cssCodeSplit: false,

      rollupOptions: {
        external: ["react", "react-dom", "react/jsx-runtime", "@go-blite/shadcn", "loadsh-es", "use-immer", "clsx"],
        treeshake: true,
        preserveEntrySignatures: "strict",
        input: ["src/index.ts"],
        output: [
          {
            dir: "dist/esm",
            format: "esm",
            sourcemap: false,
            entryFileNames: "[name].js",
            chunkFileNames: "vendor/[name].js",
            assetFileNames: "styles/index.css",
            preserveModules: true,
            preserveModulesRoot: "src"
          },
          {
            dir: "dist/lib",
            format: "cjs",
            sourcemap: false,
            entryFileNames: "[name].js",
            chunkFileNames: "vendor/[name].js",
            assetFileNames: "styles/index.css",
            preserveModules: true,
            preserveModulesRoot: "src"
          }
        ]
      }
    }
  };
});

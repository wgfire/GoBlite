import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd());

  // 检查是否为开发环境
  const isDev = mode === "development";

  // 获取 selectors 子包的路径
  const selectorsPath = path.resolve(__dirname, "../packages/selectors");
  const selectorsExists = fs.existsSync(selectorsPath);

  return {
    plugins: [
      react(),
      // 开发环境下添加 selectors 子包的热更新支持
      isDev &&
        selectorsExists && {
          name: "watch-selectors",
          configureServer(server) {
            // 监听 selectors 子包的文件变化
            server.watcher.add(`${selectorsPath}/src/**/*`);
          }
        }
    ].filter(Boolean),
    base: env.VITE_BASE_PATH,
    server: {
      port: 3000,
      open: true,
      watch: {
        // 监听 node_modules 中的 @go-blite/selectors
        ignored: ["!**/node_modules/@go-blite/selectors/**"]
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        // 开发环境下，将 @go-blite/selectors 指向源码目录
        ...(isDev && selectorsExists
          ? {
              "@go-blite/selectors/styles": path.resolve(__dirname, "../packages/selectors/dist/esm/style.css"),
              "@go-blite/selectors": path.resolve(__dirname, "../packages/selectors/src")
            }
          : {})
      },
      // 开发环境下不保留软链接，直接解析到源文件
      preserveSymlinks: !isDev
    },
    // 开发环境下禁用优化 selectors 包，确保每次修改都能生效
    optimizeDeps: {
      include: ["react", "react-dom", "ahooks", "lodash-es", "use-immer"],
      exclude: isDev ? ["@go-blite/selectors"] : []
    },
    build: {
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks: {
            design: ["@go-blite/design"],
            selectors: ["@go-blite/selectors"],
            // shadcn: ["@go-blite/shadcn"],
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
    }
  };
});

import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// 定义样式入口文件路径
// const styleEntry = resolve(__dirname, "src/styles/index.css");

export default defineConfig({
  plugins: [
    dts({
      // 类型定义文件输出到 esm 目录，与 package.json 的 "types" 字段保持一致
      outDir: "dist/esm",
      // 确保为所有入口点生成类型定义
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["node_modules/**"],
      // 确保类型定义文件保持原始目录结构
      entryRoot: "src"
    })
  ],

  build: {
    sourcemap: false,
    emptyOutDir: true,
    minify: true,

    lib: {
      // 使用主入口文件
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index"
    },
    rollupOptions: {
      // 添加样式入口文件
      input: {
        index: resolve(__dirname, "src/index.ts")
      },
      // 声明外部依赖
      external: [
        "react",
        "react-dom",
        "ahooks",
        "@go-blite/design",
        "lucide-react",
        /^react\/jsx-runtime/,
        /^react-jsx-runtime/
      ],
      output: [
        {
          dir: "dist/esm",
          format: "es",
          // 核心配置：保留原始模块结构
          preserveModules: true,
          // 将 src 目录作为根目录，这样输出的目录结构就不会包含 src
          preserveModulesRoot: "src",
          // 确保导入路径不包含扩展名
          entryFileNames: "[name].js"
        },
        {
          dir: "dist/lib",
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js"
        }
      ]
    }
  }
});

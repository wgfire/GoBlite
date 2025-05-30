/**
 * @type {import('vite').UserConfig}
 */
import react from "@vitejs/plugin-react-swc";
import { globby } from "globby";
import path from "path";
import { defineConfig } from "vite";
import typescript from "vite-plugin-dts";
import componentCssPlugin from "./scripts/vite-plugin-component-css";
export default async () => {
  // 获取组件和hooks文件
  const componentFiles = await globby(["src/components/**/*.tsx"], {
    // ignore: ["src/components/index.tsx"]
  });

  const hookFiles = await globby(["src/hooks/**/*.ts"], {
    ignore: []
  });

  const files = [...componentFiles, ...hookFiles];
  console.log(files, "files");
  return defineConfig({
    plugins: [
      react(),
      typescript({
        outDir: "dist", // 类型文件的输出目录
        exclude: ["vite.config.ts", "scripts", "tailwind.config.ts"],
        beforeWriteFile: (filePath, content) => {
          // 根据文件路径名称提取文件夹名称,并且移除文件后缀
          const filename = path.basename(filePath).split(".")[0];
          const indexpath = filePath.replace("/src", "");
          const pathname = path.dirname(filePath).replace("/src", "");
          if (filename === "index") {
            console.log(filePath, "indexpath");
            return { filePath: indexpath, content };
          }
          const newFilePath = path.join(pathname, filename, "index.d.ts");
          return { filePath: newFilePath, content };
        }
      }),
      componentCssPlugin()
    ],
    resolve: {
      alias: {
        "@": "/src"
      }
    },
    build: {
      minify: "esbuild",
      lib: {
        entry: files,
        name: "go-blite/shadcn",
        fileName: "shadcn"
      },
      rollupOptions: {
        external: ["react", "react-dom", "react/jsx-runtime"],
        plugins: [],
        output: [
          {
            format: "esm",
            dir: "dist",
            exports: "named",
            chunkFileNames: "vendor/[name].js",
            assetFileNames: "style/[name].[ext]",
            entryFileNames: chunk => {
              // 处理文件路径
              const filePath = chunk.facadeModuleId || "";

              // 处理hooks文件
              if (filePath.includes("/hooks/")) {
                const hookName = path.basename(filePath, path.extname(filePath));
                if (hookName === "index") {
                  return "hooks/index.js";
                }
                return `hooks/${hookName}.js`;
              }

              // 处理组件文件
              if (chunk.name === "index") {
                return "components/index.js";
              }
              return `components/ui/${chunk.name}/index.js`;
            }
          }
        ],
        preserveEntrySignatures: "strict"
      }
    }
  });
};

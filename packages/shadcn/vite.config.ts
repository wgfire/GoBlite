/**
 * @type {import('vite').UserConfig}
 */
import react from "@vitejs/plugin-react-swc";
import { globby } from "globby";
import path from "path";
import { defineConfig } from "vite";
import typescript from "vite-plugin-dts";
export default async () => {
  const files = await globby(["src/components/**/*.tsx"], {
    // ignore: ["src/components/index.tsx"]
  });
  console.log(files, "files");
  return defineConfig({
    plugins: [
      react(),
      typescript({
        outDir: "dist", // 类型文件的输出目录
        exclude: ["vite.config.ts", "scripts"],
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
      })
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
            entryFileNames: chunk => {
              console.log(chunk, "chunk");
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

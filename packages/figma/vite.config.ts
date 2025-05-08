import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";

// 清理目录函数
function cleanDir(dir: string) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        cleanDir(filePath);
        fs.rmdirSync(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  esbuild: {
    target: ["chrome58"],
    treeShaking: true
  },
  build: {
    minify: "terser",
    assetsDir: "assets",
    rollupOptions: {
      input: { index: "./src/main.tsx", code: "./src/plugin/autoParser.ts" },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "index.css"
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  plugins: [
    react(),
    {
      name: "clean-dist-plugin",
      apply: "build",
      buildStart() {
        const distPath = path.resolve(__dirname, "dist");
        cleanDir(distPath);
        console.log("已清理 dist 目录");
      }
    },
    {
      name: "inline-js-plugin",
      apply: "build",
      writeBundle: {
        handler() {
          let _htmlTemplate = fs.readFileSync("./ui.html", "utf-8");
          const scriptPath = path.resolve(__dirname, "./dist/index.js");
          const stylePath = path.resolve(__dirname, "./dist/index.css");

          const scriptContent = fs.readFileSync(scriptPath, "utf-8");
          const styleContent = fs.readFileSync(stylePath, "utf-8");
          const outputPath = path.resolve(__dirname, "./dist/index.html");

          // 将 JS 内容插入到 HTML 的 <body> 中
          _htmlTemplate = _htmlTemplate.replace(/<%-\s*injectScript\s*%>/, `<script>${scriptContent}</script>`);
          _htmlTemplate = _htmlTemplate.replace(/<%-\s*injectStyle\s*%>/, `<style>${styleContent}</style>`);

          fs.writeFileSync(outputPath, _htmlTemplate);
          fs.unlink(scriptPath, err => {
            if (err) console.error("删除 script 文件失败:", err);
          });
          fs.unlink(stylePath, err => {
            if (err) console.error("删除 style 文件失败:", err);
          });
        }
      }
    }
  ]
});

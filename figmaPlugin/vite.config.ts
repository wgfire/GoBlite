import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  esbuild: {
    target: ['chrome58'],
    treeShaking: true,
  },
  build: {
    minify: "terser",
    assetsDir: "assets",
    rollupOptions: {
      input: { index: "./src/main.tsx", code: "./src/plugin/controller.ts" },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "index.css",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
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
          //  console.log(_htmlTemplate, "模板");
          fs.writeFileSync(outputPath, _htmlTemplate);
          fs.unlink(scriptPath, (err) => {
            console.log(err);
          });
          fs.unlink(stylePath, (err) => {
            console.log(err);
          });
        },
      },
    },
  ],
});

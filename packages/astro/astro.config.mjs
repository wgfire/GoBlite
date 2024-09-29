import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import path from "node:path";
// 读取 scripts.json 文件
const scriptsConfig = JSON.parse(fs.readFileSync("./page.json", "utf-8"));

// 创建 Vite 插件
const dynamicScriptsPlugin = () => {
  return {
    name: "dynamic-scripts-plugin",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        console.log("dir", dir);
        // 复制所需的 JS 文件到打包后的目录
        scriptsConfig.scripts.forEach((script) => {
          const srcPath = path.resolve(`node_modules/@go-blite/events/dist/umd/${script}/${script}.umd.js`);
          const destPath = path.resolve(dir.pathname, `chunks/${script}.umd.js`);
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.copyFileSync(srcPath, destPath);
        });
      },
    },
  };
};
// https://astro.build/config
export default defineConfig({
  // Enable React to support React JSX components.
  integrations: [react(), dynamicScriptsPlugin()],
  build: {
    assetsPrefix: "./",
  },
});

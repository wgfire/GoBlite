import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// fs 模块在当前配置中不需要使用

// 优先从环境变量获取 web-site/src/selectors 的绝对路径
// 这使得路径可以在构建脚本中动态设置，适应临时构建目录
const webSiteSelectorsPathFromEnv = process.env.WEB_SITE_SELECTORS_ABSOLUTE_PATH;

const webSiteSelectorsPath = webSiteSelectorsPathFromEnv || path.resolve(__dirname, "../../web-site/src/selectors");

if (!webSiteSelectorsPathFromEnv) {
  console.warn(
    "WEB_SITE_SELECTORS_ABSOLUTE_PATH environment variable is not set. " +
      "Falling back to relative path calculation. This might not work in temporary build directories."
  );
}
console.log("Vite config: webSiteSelectorsPath resolved to:", webSiteSelectorsPath);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    commonjsOptions: {
      // 确保 commonjs 插件可以处理 web-site 中的文件
      include: [/node_modules/, new RegExp(webSiteSelectorsPath.replace(/\\/g, "\\\\"))]
    },
    rollupOptions: {
      // 确保 Rollup 可以正确处理外部引用
      onwarn(warning, warn) {
        // 忽略某些警告
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" ||
          (warning.message && warning.message.includes("@web-site-selectors"))
        ) {
          return;
        }
        warn(warning);
      }
    }
  },
  server: {
    port: 3003
  },
  optimizeDeps: {
    // 包含 web-site/src/selectors 目录下的所有文件
    include: ["@web-site-selectors"],
    esbuildOptions: {
      // 确保 esbuild 可以处理 web-site 中的文件
      plugins: [
        {
          name: "external-files-resolver", // 插件名称更具体些
          setup(build) {
            build.onResolve({ filter: /^@web-site-selectors(\/.*)?$/ }, args => {
              // 匹配 @web-site-selectors 或 @web-site-selectors/path/to/file
              const relativePath = args.path.substring("@web-site-selectors".length); // 获取 /path/to/file 部分
              const fullPath = path.join(webSiteSelectorsPath, relativePath);
              return { path: fullPath };
            });
          }
        }
      ]
    }
  },
  resolve: {
    alias: {
      // 添加路径别名，指向 web-site 的 selectors 目录
      "@web-site-selectors": webSiteSelectorsPath
    }
  }
});

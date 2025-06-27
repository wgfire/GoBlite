import fs from "fs";
import path from "path";
import { exec } from "child_process";
import chokidar from "chokidar";
import { fileURLToPath } from "url";

// 在 ES 模块中获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 路径配置
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.resolve(rootDir, "src");
const distDir = path.resolve(rootDir, "dist");
const cssOutputDir = path.resolve(distDir, "esm");
const cssOutputFile = path.resolve(cssOutputDir, "style.css");
const cssInputFile = path.resolve(srcDir, "styles/index.css");
const tailwindConfigFile = path.resolve(rootDir, "tailwind.config.ts");

// 确保输出目录存在
if (!fs.existsSync(cssOutputDir)) {
  fs.mkdirSync(cssOutputDir, { recursive: true });
}

// 检查输入文件是否存在
if (!fs.existsSync(cssInputFile)) {
  console.error(`❌ 输入文件不存在: ${cssInputFile}`);
  process.exit(1);
}

// 检查配置文件是否存在
if (!fs.existsSync(tailwindConfigFile)) {
  console.error(`❌ Tailwind 配置文件不存在: ${tailwindConfigFile}`);
  process.exit(1);
}

// 构建CSS函数
function buildCSS() {
  console.log("🔄 构建CSS文件...");
  console.log(`⏱️ 构建时间: ${new Date().toLocaleTimeString()}`);

  // 使用tailwindcss命令行构建CSS
  const command = `npx tailwindcss -i "${cssInputFile}" -o "${cssOutputFile}" --config "${tailwindConfigFile}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ 构建失败: ${error.message}`);
      return;
    }

    if (stderr && stderr.trim() !== "") {
      console.error(`⚠️ 警告: ${stderr}`);
    }

    // 构建成功后，复制文件到其他目标目录
    try {
      const esmStyleFile = path.resolve(distDir, "esm/style.css");
      const libStyleFile = path.resolve(distDir, "lib/style.css");

      // 确保目标目录存在
      const esmDir = path.dirname(esmStyleFile);
      const libDir = path.dirname(libStyleFile);

      if (!fs.existsSync(esmDir)) {
        fs.mkdirSync(esmDir, { recursive: true });
      }

      if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir, { recursive: true });
      }

      // 复制文件
      fs.copyFileSync(cssOutputFile, esmStyleFile);
      fs.copyFileSync(cssOutputFile, libStyleFile);

      const stats = fs.statSync(cssOutputFile);
      const sizeKB = (stats.size / 1024).toFixed(2);

      console.log(`✅ CSS构建完成: ${cssOutputFile} (${sizeKB}KB)`);
      console.log(`📋 已复制到: ${esmStyleFile}`);
      console.log(`📋 已复制到: ${libStyleFile}`);
    } catch (err) {
      console.error(`❌ 复制文件失败: ${err.message}`);
    }
  });
}

// 初始构建
buildCSS();

// 监听文件变化
console.log("👀 监听文件变化...");

// 定义需要监听的文件模式
const watchPatterns = [
  // 监听整个src目录
  srcDir,
  // 监听配置文件
  tailwindConfigFile
];

// 输出监听的文件路径，便于调试
console.log("📁 监听以下文件模式:");
watchPatterns.forEach(pattern => console.log(`   - ${pattern}`));

// 创建监听器，使用更直接的配置
const watcher = chokidar.watch(watchPatterns, {
  ignored: [
    /(^|[/\\])\./, // 忽略点文件
    /(node_modules|dist|build)/ // 忽略这些目录
  ],
  persistent: true,
  ignoreInitial: true,
  followSymlinks: false,
  alwaysStat: true,
  depth: 99, // 监听的最大嵌套深度
  usePolling: true, // 强制使用轮询
  interval: 100, // 轮询间隔更短
  awaitWriteFinish: false // 关闭写入完成检测，立即响应变化
});

// 监听所有事件
watcher
  .on("change", filePath => {
    console.log(`📄 文件变更: ${filePath}`);
    console.log("🔍 检测到变更类型: change");
    buildCSS();
  })
  .on("add", filePath => {
    console.log(`➕ 新增文件: ${filePath}`);
    buildCSS();
  })
  .on("unlink", filePath => {
    console.log(`➖ 删除文件: ${filePath}`);
    buildCSS();
  })
  .on("error", error => {
    console.error(`❌ 监听错误: ${error}`);
  })
  .on("ready", () => {
    console.log("✅ 初始扫描完成，开始监听文件变化");
  });

console.log("🚀 CSS监听器已启动");

// 处理退出信号
process.on("SIGINT", () => {
  console.log("👋 停止CSS监听器");
  watcher.close();
  process.exit(0);
});

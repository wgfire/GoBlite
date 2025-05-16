const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

const TEMP_SCHEMA_DIR = process.env.TEMP_SCHEMA_DIR || path.join(__dirname, "..", "..", "schemas");
const BUILD_OUTPUT_DIR = process.env.BUILD_OUTPUT_DIR || path.join(__dirname, "..", "..", "build_outputs");
const VITE_TEMPLATE_DIR =
  process.env.VITE_TEMPLATE_DIR || path.join(__dirname, "..", "..", "templates", "vite-react-template");

// 确保目录存在
fs.ensureDirSync(TEMP_SCHEMA_DIR);
fs.ensureDirSync(BUILD_OUTPUT_DIR);

// 简单的内存缓存，用于跟踪构建状态和结果
// 生产环境应使用 Redis 或数据库
const buildCache = new Map();

// 初始化模板目录，确保依赖已安装
async function initializeTemplateDir() {
  logger.info(`Initializing template directory: ${VITE_TEMPLATE_DIR}`);

  if (!fs.existsSync(VITE_TEMPLATE_DIR)) {
    logger.error(`Template directory does not exist: ${VITE_TEMPLATE_DIR}`);
    throw new Error(`Template directory does not exist: ${VITE_TEMPLATE_DIR}`);
  }

  // 检查 node_modules 是否存在，如果不存在则安装依赖
  const nodeModulesPath = path.join(VITE_TEMPLATE_DIR, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    logger.info("Installing dependencies in template directory...");
    try {
      const { stdout, stderr } = await require("util").promisify(exec)("pnpm install", {
        cwd: VITE_TEMPLATE_DIR
      });
      logger.info("Template dependencies installed successfully.");
      logger.debug(`stdout: ${stdout}`);
      if (stderr) logger.warn(`stderr: ${stderr}`);
    } catch (error) {
      logger.error(`Failed to install template dependencies: ${error.message}`);
      throw error;
    }
  } else {
    logger.info("Template dependencies already installed.");
  }
}

// 启动时初始化模板目录
initializeTemplateDir().catch(err => {
  logger.error(`Failed to initialize template directory: ${err.message}`);
  process.exit(1);
});

async function createProjectFromTemplate(projectName, schemaData) {
  const outputPath = path.join(BUILD_OUTPUT_DIR, projectName);
  const templateSchemaPath = path.join(VITE_TEMPLATE_DIR, "src", "schema.json");

  logger.info(`[${projectName}] Preparing build for project ${projectName}`);

  // 确保输出目录存在
  if (await fs.pathExists(outputPath)) {
    logger.warn(`[${projectName}] Output path already exists. Cleaning up: ${outputPath}`);
    await fs.remove(outputPath);
  }
  await fs.ensureDir(outputPath);

  try {
    // 写入 schema 数据到模板目录
    await fs.writeJson(templateSchemaPath, schemaData, { spaces: 2 });
    logger.info(`[${projectName}] Schema data written to template: ${templateSchemaPath}`);

    // 创建临时的 vite.config.js 来覆盖输出目录
    const viteConfigPath = path.join(VITE_TEMPLATE_DIR, "vite.config.js");
    const originalViteConfig = await fs.readFile(viteConfigPath, "utf-8");

    // 保存原始配置
    const backupConfigPath = path.join(VITE_TEMPLATE_DIR, "vite.config.js.backup");
    await fs.writeFile(backupConfigPath, originalViteConfig);

    // 修改 vite.config.js 以输出到指定目录
    const newViteConfig = `
    import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";
    import path from "path";
    export default defineConfig({
      plugins: [react()],
      base: "./",
      build: {
        outDir: "${outputPath.replace(/\\/g, "\\\\")}"
      }
    });
`;

    await fs.writeFile(viteConfigPath, newViteConfig);
    logger.info(`[${projectName}] Updated vite.config.js to output to: ${outputPath}`);

    return VITE_TEMPLATE_DIR;
  } catch (error) {
    logger.error(`[${projectName}] Error preparing build: ${error.message}`);
    throw error;
  }
}

function runViteBuild(templatePath, projectName) {
  return new Promise((resolve, reject) => {
    const buildId = buildCache.get(projectName)?.buildId || projectName;
    const outputPath = path.join(BUILD_OUTPUT_DIR, buildId);
    const logStream = fs.createWriteStream(path.join(__dirname, "..", "..", "logs", `${buildId}-build-output.log`), {
      flags: "a"
    });

    logger.info(`[${projectName}] Starting Vite build in template directory, outputting to: ${outputPath}`);

    // 直接在模板目录中执行构建，不需要每次都安装依赖
    // 如果模板依赖有更新，可以手动在模板目录中执行 pnpm install
    const buildProcess = exec("pnpm run build", { cwd: templatePath });

    buildProcess.stdout.on("data", data => {
      logger.info(`[${projectName}-stdout] ${data.toString().trim()}`);
      logStream.write(data);
    });

    buildProcess.stderr.on("data", data => {
      logger.error(`[${projectName}-stderr] ${data.toString().trim()}`);
      logStream.write(data);
    });

    buildProcess.on("close", code => {
      logStream.end();

      // 构建完成后，恢复原始的 vite.config.js
      const viteConfigPath = path.join(templatePath, "vite.config.js");
      const backupConfigPath = path.join(templatePath, "vite.config.js.backup");

      try {
        if (fs.existsSync(backupConfigPath)) {
          fs.copyFileSync(backupConfigPath, viteConfigPath);
          fs.removeSync(backupConfigPath);
          logger.info(`[${projectName}] Restored original vite.config.js`);
        }
      } catch (err) {
        logger.error(`[${projectName}] Error restoring vite.config.js: ${err.message}`);
      }

      if (code === 0) {
        logger.info(`[${projectName}] Vite build successful.`);
        resolve(outputPath); // 直接返回输出目录
      } else {
        logger.error(`[${projectName}] Vite build failed with code ${code}.`);
        reject(new Error(`Vite build failed for ${projectName}. Check logs.`));
      }
    });
  });
}

function zipDirectory(sourceDir, outPath, projectName) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    logger.info(`[${projectName}] Zipping directory ${sourceDir} to ${outPath}`);
    archive
      .directory(sourceDir, false)
      .on("error", err => reject(err))
      .pipe(stream);

    stream.on("close", () => {
      logger.info(`[${projectName}] Zipping complete. Total bytes: ${archive.pointer()}`);
      resolve(outPath);
    });
    archive.finalize();
  });
}

async function buildProject(projectName, schemaData) {
  const buildId = uuidv4();
  const status = {
    buildId,
    projectName,
    status: "pending",
    startTime: new Date(),
    logs: [],
    zipPath: null,
    error: null
  };
  buildCache.set(buildId, status); // 使用 buildId 作为 key

  const updateStatus = update => {
    const current = buildCache.get(buildId);
    buildCache.set(buildId, { ...current, ...update });
    logger.info(`[Build ${buildId}] Status updated: ${update.status || current.status}`);
  };

  try {
    updateStatus({ status: "creating_project" });
    const projectPath = await createProjectFromTemplate(buildId, schemaData); // 使用 buildId 作为项目目录名避免冲突

    updateStatus({ status: "installing_dependencies_and_building" });
    const buildOutputDir = await runViteBuild(projectPath, buildId);

    updateStatus({ status: "zipping_output" });
    const zipFileName = `${buildId}.zip`;
    const zipFilePath = path.join(BUILD_OUTPUT_DIR, zipFileName);
    const buildOutputDirs = path.join(VITE_TEMPLATE_DIR, buildOutputDir);
    logger.info(`[Build ${buildId}] Project output directory: ${buildOutputDirs}`);
    await zipDirectory(buildOutputDirs, zipFilePath, buildId);

    updateStatus({
      status: "completed",
      zipPath: zipFilePath,
      endTime: new Date()
    });
    logger.info(`[Build ${buildId}] Project built and zipped successfully: ${zipFilePath}`);
    return { buildId, zipPath: zipFilePath, message: "Build successful" };
  } catch (error) {
    logger.error(`[Build ${buildId}] Build process failed for ${projectName}: ${error.message}`);
    updateStatus({
      status: "failed",
      error: error.message,
      endTime: new Date()
    });
    throw error; // Re-throw for the route handler
  }
}

function getBuildStatus(buildId) {
  return buildCache.get(buildId);
}

module.exports = {
  buildProject,
  getBuildStatus
};

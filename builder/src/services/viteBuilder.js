const { exec } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

const TEMP_SCHEMA_DIR = process.env.TEMP_SCHEMA_DIR || path.join(__dirname, "..", "..", "schemas");
const BUILD_OUTPUT_DIR = process.env.BUILD_OUTPUT_DIR || path.join(__dirname, "..", "..", "build_outputs");
const VITE_TEMPLATE_DIR =
  process.env.VITE_TEMPLATE_DIR || path.join(__dirname, "..", "..", "templates", "vite-react-template"); // 你需要创建这个模板

// 确保目录存在
fs.ensureDirSync(TEMP_SCHEMA_DIR);
fs.ensureDirSync(BUILD_OUTPUT_DIR);

// 简单的内存缓存，用于跟踪构建状态和结果
// 生产环境应使用 Redis 或数据库
const buildCache = new Map();

async function createProjectFromTemplate(projectName, schemaData) {
  const projectPath = path.join(BUILD_OUTPUT_DIR, projectName);
  const schemaFilePath = path.join(projectPath, "src", "schema.json"); // 将 schema 放在项目的 src 下

  logger.info(`[${projectName}] Creating project from template at ${projectPath}`);

  if (await fs.pathExists(projectPath)) {
    logger.warn(`[${projectName}] Project path already exists. Cleaning up: ${projectPath}`);
    await fs.remove(projectPath); // 清理旧的，或者你可以实现版本控制
  }

  try {
    await fs.copy(VITE_TEMPLATE_DIR, projectPath);
    logger.info(`[${projectName}] Copied template to ${projectPath}`);

    // 写入 schema 数据
    await fs.writeJson(schemaFilePath, schemaData, { spaces: 2 });
    logger.info(`[${projectName}] Schema data written to ${schemaFilePath}`);

    return projectPath;
  } catch (error) {
    logger.error(`[${projectName}] Error creating project from template: ${error.message}`);
    throw error;
  }
}

function runViteBuild(projectPath, projectName) {
  return new Promise((resolve, reject) => {
    const buildId = buildCache.get(projectName)?.buildId || projectName;
    const logStream = fs.createWriteStream(path.join(__dirname, "..", "..", "logs", `${buildId}-build-output.log`), {
      flags: "a"
    });

    logger.info(`[${projectName}] Starting Vite build in ${projectPath}`);
    // 注意：确保 vite 是全局安装的，或者在模板的 package.json 中作为 devDependency

    const buildProcess = exec("npm install && npm run build", { cwd: projectPath });

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
      if (code === 0) {
        logger.info(`[${projectName}] Vite build successful.`);
        resolve(path.join(projectPath, "dist")); // Vite 构建输出目录
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
    await zipDirectory(buildOutputDir, zipFilePath, buildId);

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

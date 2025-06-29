import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import archiver from "archiver";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { promisify } from "util";
import logger from "../utils/logger.js"; // Assuming logger.js will also be an ES module or has a compatible default export

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMP_SCHEMA_DIR = process.env.TEMP_SCHEMA_DIR || path.join(__dirname, "..", "..", "schemas");
const BUILD_OUTPUT_DIR = process.env.BUILD_OUTPUT_DIR || path.join(__dirname, "..", "..", "build_outputs");
const VITE_TEMPLATE_DIR =
  process.env.VITE_TEMPLATE_DIR || path.join(__dirname, "..", "..", "templates", "operation-template");

// 确保目录存在
fs.ensureDirSync(TEMP_SCHEMA_DIR);
fs.ensureDirSync(BUILD_OUTPUT_DIR);

// 简单的内存缓存，用于跟踪构建状态和结果
// 生产环境应使用 Redis 或数据库
const buildCache = new Map();

function sanitizeFileName(name) {
  if (!name || typeof name !== "string") {
    return "default_project_name";
  }
  let saneName = name.trim();
  // eslint-disable-next-line no-control-regex
  saneName = saneName.replace(/[<>:"/\\|?*\x00-\x1F]|(\.\.)+/g, "_");
  saneName = saneName.replace(/_{2,}/g, "_");
  saneName = saneName.replace(/^[_.]+|[_.]+$/g, "");
  if (saneName === "" || /^\.+$/.test(saneName)) {
    saneName = "default_project_name";
  }
  // Limit length to avoid overly long filenames
  const maxLength = 100;
  if (saneName.length > maxLength) {
    saneName = saneName.substring(0, maxLength).replace(/[_.]+$/g, ""); // Ensure it doesn't end with _ or . after truncation
  }
  if (saneName === "") {
    // Final fallback if truncation results in empty string
    saneName = "default_project_name";
  }
  return saneName;
}

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
      const execAsync = promisify(exec);
      const { stdout, stderr } = await execAsync("pnpm install", {
        cwd: VITE_TEMPLATE_DIR
      });
      logger.info("Template dependencies installed successfully.");
      logger.debug(`stdout: ${stdout}`);
      if (stderr) logger.warn(`stderr: ${stderr}`);
    } catch (error) {
      let detailedErrorMessage = `Failed to install template dependencies: ${error.message}\n`;
      if (error.stdout) {
        detailedErrorMessage += `STDOUT: ${error.stdout}\n`;
      }
      if (error.stderr) {
        detailedErrorMessage += `STDERR: ${error.stderr}\n`;
      }
      logger.error(detailedErrorMessage);
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

async function createProjectFromTemplate(buildId, schemaData) {
  // Create a unique temporary directory for this specific build
  const tempProjectRootPath = path.join(BUILD_OUTPUT_DIR, `${buildId}_temp_project`);

  // Add these logs (after tempProjectRootPath is defined):
  logger.info(`[Debug Paths] VITE_TEMPLATE_DIR: ${VITE_TEMPLATE_DIR}`);
  logger.info(`[Debug Paths] BUILD_OUTPUT_DIR: ${BUILD_OUTPUT_DIR}`);
  logger.info(`[Debug Paths] tempProjectRootPath: ${tempProjectRootPath}`);
  const buildArtifactsDirName = "dist"; // Standard output directory for Vite builds
  const finalBuildOutputPath = path.join(tempProjectRootPath, buildArtifactsDirName);

  logger.info(`[Build ${buildId}] Creating isolated project directory: ${tempProjectRootPath}`);

  try {
    // Clean up any pre-existing temp directory for this buildId (should not happen with UUIDs)
    if (await fs.pathExists(tempProjectRootPath)) {
      logger.warn(`[Build ${buildId}] Temporary project path already exists. Cleaning up: ${tempProjectRootPath}`);
      await fs.remove(tempProjectRootPath);
    }
    // Copy the entire base template directory to the temporary location
    await fs.copy(VITE_TEMPLATE_DIR, tempProjectRootPath);
    logger.info(`[Build ${buildId}] Copied template from ${VITE_TEMPLATE_DIR} to ${tempProjectRootPath}`);

    // Define paths within the new temporary project directory
    const tempSchemaPath = path.join(tempProjectRootPath, "src", "schema.json");
    const tempViteConfigPath = path.join(tempProjectRootPath, "vite.config.js");

    // Write schema data into the temporary project's schema file
    await fs.writeJson(tempSchemaPath, schemaData, { spaces: 2 });
    logger.info(`[Build ${buildId}] Schema data written to temporary project: ${tempSchemaPath}`);

    // Generate a vite.config.js specifically for this build, outputting to its 'dist' subdir
    // Note: outDir is relative to the root of the tempProjectRootPath
    const viteConfigContent = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets are linked relatively
  build: {
    outDir: '${buildArtifactsDirName}', // Output to 'dist' folder within the isolated project
    emptyOutDir: true // Clean the output directory before build
  },
  server: {
    // Port for dev server, not critical for build but good practice to include
    port: 3003 
  },
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      '@go-blite/design',
      "@go-blite/selectors"
    ]
  }
});
`;
    await fs.writeFile(tempViteConfigPath, viteConfigContent);
    logger.info(`[Build ${buildId}] Generated vite.config.js in temporary project: ${tempViteConfigPath}`);

    // Return the path to the root of this isolated temporary project and its expected output dir
    return { isolatedPath: tempProjectRootPath, buildOutputPath: finalBuildOutputPath };
  } catch (error) {
    logger.error(`[Build ${buildId}] Error creating isolated project: ${error.message}`);
    // Attempt to clean up if project creation failed mid-way
    if (await fs.pathExists(tempProjectRootPath)) {
      await fs
        .remove(tempProjectRootPath)
        .catch(cleanupErr =>
          logger.error(`[Build ${buildId}] Failed to cleanup partially created temp project: ${cleanupErr.message}`)
        );
    }
    throw error;
  }
}

function runViteBuild(isolatedProjectPath, buildId, expectedBuildOutputPath) {
  return new Promise((resolve, reject) => {
    // buildId is now passed directly
    // const outputPath = path.join(BUILD_OUTPUT_DIR, buildId); // This line is no longer needed and was causing a lint error.
    const logStream = fs.createWriteStream(path.join(BUILD_OUTPUT_DIR, `${buildId}.log`), { flags: "a" });

    logger.info(`[Build ${buildId}] Starting Vite build in: ${isolatedProjectPath}`);

    // 直接在模板目录中执行构建，不需要每次都安装依赖
    // 如果模板依赖有更新，可以手动在模板目录中执行 pnpm install
    const mode = process.env.NODE_ENV;
    const execValue = mode ? `npm run build -- --mode ${mode}` : "npm run build";
    const buildProcess = exec(execValue, { cwd: isolatedProjectPath });

    buildProcess.stdout.on("data", data => {
      logger.info(`[Build ${buildId}-stdout] ${data.toString().trim()}`);
      logStream.write(data);
    });

    buildProcess.stderr.on("data", data => {
      logger.error(`[Build ${buildId}-stderr] ${data.toString().trim()}`);
      logStream.write(data);
    });

    buildProcess.on("close", code => {
      logStream.end();

      // No need to restore vite.config.js as we are in a temporary, isolated directory
      // This entire directory will be deleted later.

      if (code === 0) {
        logger.info(`[Build ${buildId}] Vite build successful. Output at: ${expectedBuildOutputPath}`);
        resolve(expectedBuildOutputPath); // Return the path to the actual built artifacts
      } else {
        logger.error(`[Build ${buildId}] Vite build failed with code ${code}.`);
        reject(new Error(`Vite build failed for build ${buildId}. Check logs.`));
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
  const sanitizedProjectName = sanitizeFileName(projectName);
  let isolatedProjectPath = null; // To store the path for cleanup
  const status = {
    buildId,
    projectName: sanitizedProjectName, // Store/report the sanitized name
    originalProjectName: projectName, // Keep original for logs if needed
    status: "pending",
    startTime: new Date(),
    logs: [],
    zipPath: null,
    error: null
  };
  buildCache.set(buildId, status); // Use buildId as the primary key for the cache

  const updateStatus = update => {
    const current = buildCache.get(buildId);
    buildCache.set(buildId, { ...current, ...update });
    logger.info(`[Build ${buildId} (${projectName})}] Status updated: ${update.status || current.status}`);
  };

  try {
    updateStatus({ status: "creating_project_environment" });
    // Create an isolated project environment. This returns paths to the isolated root and its expected build output dir.
    const { isolatedPath, buildOutputPath } = await createProjectFromTemplate(buildId, schemaData);
    isolatedProjectPath = isolatedPath; // Store for cleanup

    updateStatus({ status: "building_project" });
    // Run the Vite build within the isolated environment.
    // runViteBuild now expects the path to the isolated project, the buildId, and the expected output path.
    const actualBuiltArtifactsPath = await runViteBuild(isolatedProjectPath, buildId, buildOutputPath);

    updateStatus({ status: "zipping_output" });
    const zipFileName = `${sanitizedProjectName}.zip`;
    const zipFilePath = path.join(BUILD_OUTPUT_DIR, zipFileName); // Zip file will be in the main BUILD_OUTPUT_DIR

    // The source for zipping is the 'dist' (or equivalent) directory within the isolated project.
    const sourceDirectoryForZip = actualBuiltArtifactsPath;
    logger.info(`[Build ${buildId} (${projectName})] Source directory for zipping: ${sourceDirectoryForZip}`);

    await zipDirectory(sourceDirectoryForZip, zipFilePath, buildId);

    updateStatus({
      status: "completed",
      zipPath: zipFilePath,
      endTime: new Date()
    });
    logger.info(
      `[Build ${buildId} (${projectName})] Project built and zipped successfully as ${zipFileName}: ${zipFilePath}`
    );
    return { buildId, zipPath: zipFilePath, message: "Build successful" };
  } catch (error) {
    logger.error(`[Build ${buildId} (${projectName})] Build process failed: ${error.message}`);
    logger.error(error.stack);
    updateStatus({
      status: "failed",
      error: error.message,
      endTime: new Date()
    });
    throw error;
  } finally {
    // Cleanup: Remove the temporary isolated project directory after build attempt
    if (isolatedProjectPath) {
      try {
        logger.info(
          `[Build ${buildId} (${projectName})] Cleaning up temporary project directory: ${isolatedProjectPath}`
        );
        await fs.remove(isolatedProjectPath);
        logger.info(`[Build ${buildId} (${projectName})] Temporary project directory cleaned up successfully.`);
      } catch (cleanupError) {
        logger.error(
          `[Build ${buildId} (${projectName})] Error cleaning up temporary project directory ${isolatedProjectPath}: ${cleanupError.message}`
        );
      }
    }
  }
}

function getBuildStatus(buildId) {
  return buildCache.get(buildId);
}

export { buildProject, getBuildStatus };

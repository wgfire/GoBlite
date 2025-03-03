import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
import { BuildContext, BuildResult, BuildProgress } from "../types";
import { BaseBuildStrategy } from "./build-strategy";
import { PostBuildManager } from "../post-build/post-build-manager";

const execAsync = promisify(exec);

export class NextBuildStrategy extends BaseBuildStrategy {
  private postBuildManager: PostBuildManager;

  constructor() {
    super();
    this.postBuildManager = new PostBuildManager();
  }

  private getOutputDir(context: BuildContext): string {
    // 获取项目根目录
    const projectRoot = path.resolve(__dirname, "../..");
    // 使用相对路径，与 next.config.mjs 保持一致
    const relativePath = `.build-cache/${context.buildId}/.next`;
    return path.join(projectRoot, relativePath);
  }

  async prepare(context: BuildContext): Promise<void> {
    // 清理之前的构建文件
    const outputDir = this.getOutputDir(context);
    // 确保缓存目录存在
    await fs.ensureDir(path.dirname(outputDir));

    // 如果有 schema，写入到 app 目录
    if (context.config.schema) {
      const appDir = path.join(process.cwd(), "app");
      const schemaPath = path.join(appDir, "schema.json");

      try {
        // 确保 app 目录存在
        await fs.ensureDir(appDir);

        // 写入 schema 文件
        await fs.writeFile(schemaPath, context.config.schema, "utf-8");
        console.log(`Schema written to ${schemaPath}`);
      } catch (error) {
        console.error("Error writing schema:", error);
        throw new Error("Failed to write schema file");
      }
    }
  }

  async execute(context: BuildContext, onProgress?: (progress: BuildProgress) => void): Promise<BuildResult> {
    const startTime = Date.now();

    try {
      // 初始化阶段
      onProgress?.(await this.createProgressUpdate(context, "initializing", 0, "Initializing build environment"));

      // 准备阶段
      onProgress?.(await this.createProgressUpdate(context, "preparing", 20, "Preparing Next.js build"));

      // 构建阶段
      onProgress?.(await this.createProgressUpdate(context, "building", 40, "Running Next.js build"));

      // 获取项目根目录和输出目录
      const projectRoot = path.resolve(__dirname, "../..");
      const outputDir = this.getOutputDir(context);

      // 执行构建命令
      const buildCommand = "pnpm run next-build";
      console.log(`Executing build command: ${buildCommand} in directory: ${projectRoot}`);

      const { stdout, stderr } = await execAsync(buildCommand, {
        cwd: projectRoot,
        env: {
          ...process.env,
          BUILD_ID: context.buildId,
          NEXT_TELEMETRY_DISABLED: "1"
        }
      });

      // 打印构建输出以便调试
      console.log("Build output:", stdout);
      if (stderr) {
        console.error("Build error:", stderr);
      }

      // 检查构建产物是否存在
      if (!(await fs.pathExists(outputDir))) {
        console.error("Output directory not found:", outputDir);
        console.error("Current directory contents:", await fs.readdir(projectRoot));
        throw new Error(`Build output directory not found: ${outputDir}`);
      }

      // 优化阶段
      onProgress?.(await this.createProgressUpdate(context, "optimizing", 60, "Optimizing build output"));

      // 打包阶段
      onProgress?.(await this.createProgressUpdate(context, "packaging", 80, "Packaging build output"));

      const buildResult: BuildResult = {
        success: true,
        buildId: context.buildId,
        outputPath: outputDir,
        duration: Date.now() - startTime,
        cached: false,
        metrics: {
          startTime,
          endTime: Date.now(),
          duration: Date.now() - startTime,
          memory: process.memoryUsage(),
          cpu: process.cpuUsage()
        }
      };

      // 后处理阶段
      const processedResult = await this.postBuildManager.process(context.config.type, context, buildResult);

      // 清理阶段
      onProgress?.(await this.createProgressUpdate(context, "cleaning", 90, "Cleaning up temporary files"));

      // 完成阶段
      onProgress?.(await this.createProgressUpdate(context, "completed", 100, "Build completed successfully"));

      return processedResult;
    } catch (error) {
      // 失败阶段
      onProgress?.(
        await this.createProgressUpdate(
          context,
          "failed",
          0,
          error instanceof Error ? error.message : "Unknown error occurred"
        )
      );

      console.error("Build failed:", error);
      const buildError = error instanceof Error ? error : new Error(String(error));
      return {
        success: false,
        buildId: context.buildId,
        error: buildError,
        duration: Date.now() - startTime,
        cached: false
      };
    }
  }

  async cleanup(context: BuildContext): Promise<void> {
    // 如果不需要保留构建目录，则清理

    await fs.remove(this.getOutputDir(context));
  }

  async validate(context: BuildContext): Promise<boolean> {
    try {
      // 1. 验证构建类型是否支持
      if (!this.postBuildManager.hasStrategy(context.config.type)) {
        console.error(`Unsupported build type: ${context.config.type}`);
        return false;
      }

      // 2. 验证项目根目录是否包含必要的 Next.js 文件
      const projectRoot = path.resolve(__dirname, "../..");
      const requiredFiles = ["next.config.mjs", "package.json"];
      const missingFiles: string[] = [];

      for (const file of requiredFiles) {
        const exists = await fs.pathExists(path.join(projectRoot, file));
        if (!exists) {
          missingFiles.push(file);
        }
      }

      if (missingFiles.length > 0) {
        console.error("Missing required Next.js files:", missingFiles);
        return false;
      }

      // 3. 验证构建配置
      if (!context.config) {
        console.error("Build configuration is missing");
        return false;
      }

      if (!context.buildId) {
        console.error("Build ID is missing");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  }

  async getHash(context: BuildContext): Promise<string> {
    const hash = crypto.createHash("md5");
    hash.update(JSON.stringify(context.config));
    return hash.digest("hex");
  }
}

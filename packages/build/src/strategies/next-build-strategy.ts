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

  async prepare(context: BuildContext): Promise<void> {
    // 确保目录存在
    await fs.ensureDir(context.workingDir);
    await fs.ensureDir(context.outputDir);
    await fs.ensureDir(context.tempDir);

    // 复制 Next.js 配置文件
    if (context.config.nextConfig) {
      const nextConfigPath = path.join(context.workingDir, "next.config.js");
      await fs.writeFile(nextConfigPath, `module.exports = ${JSON.stringify(context.config.nextConfig, null, 2)}`);
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

      const { stderr } = await execAsync("next build", {
        cwd: context.workingDir,
        env: {
          ...process.env,
          BUILD_ID: context.buildId,
          NEXT_TELEMETRY_DISABLED: "1"
        }
      });

      if (stderr) {
        console.warn("Build warnings:", stderr);
      }

      // 优化阶段
      onProgress?.(await this.createProgressUpdate(context, "optimizing", 60, "Optimizing build output"));

      // 收集构建产物
      const assets = await this.collectAssets(context);

      let buildResult: BuildResult = {
        success: true,
        buildId: context.buildId,
        outputPath: context.outputDir,
        duration: Date.now() - startTime,
        cached: false,
        assets,
        metrics: {
          startTime,
          endTime: Date.now(),
          duration: Date.now() - startTime,
          memory: process.memoryUsage(),
          cpu: process.cpuUsage()
        }
      };

      // 后处理阶段
      onProgress?.(await this.createProgressUpdate(context, "packaging", 80, "Running post-build processing"));

      if (this.postBuildManager.hasStrategy(context.config.type)) {
        buildResult = await this.postBuildManager.process(context.config.type, context, buildResult);
      }

      // 完成阶段
      onProgress?.(await this.createProgressUpdate(context, "completed", 100, "Build completed successfully"));

      return buildResult;
    } catch (error) {
      onProgress?.(
        await this.createProgressUpdate(
          context,
          "failed",
          0,
          error instanceof Error ? error.message : "Unknown error occurred"
        )
      );

      throw error;
    }
  }

  async cleanup(context: BuildContext): Promise<void> {
    try {
      // 清理临时目录
      await fs.remove(context.tempDir);

      // 可选：清理工作目录（如果不需要保留）
      if (!context.config.optimization?.keepWorkingDir) {
        await fs.remove(context.workingDir);
      }
    } catch (error) {
      console.error("Cleanup error:", error);
      throw error;
    }
  }

  async validate(context: BuildContext): Promise<boolean> {
    try {
      // 验证必要的目录和文件
      const workingDirExists = await fs.pathExists(context.workingDir);
      const outputDirExists = await fs.pathExists(context.outputDir);

      if (!workingDirExists || !outputDirExists) {
        return false;
      }

      // 验证Next.js配置
      if (context.config.nextConfig) {
        const nextConfigPath = path.join(context.workingDir, "next.config.js");
        const configExists = await fs.pathExists(nextConfigPath);
        if (!configExists) {
          return false;
        }
      }

      // 验证构建类型是否支持
      if (!this.postBuildManager.hasStrategy(context.config.type)) {
        console.warn(`No post-build strategy found for type: ${context.config.type}`);
      }

      return true;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  }

  async getHash(context: BuildContext): Promise<string> {
    const hash = crypto.createHash("sha256");

    // 添加构建配置到哈希
    hash.update(JSON.stringify(context.config));

    // 添加工作目录内容到哈希
    const files = await fs.readdir(context.workingDir);
    for (const file of files) {
      const filePath = path.join(context.workingDir, file);
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        const content = await fs.readFile(filePath);
        hash.update(content);
      }
    }

    return hash.digest("hex");
  }

  private async collectAssets(context: BuildContext) {
    const assets = {
      html: [] as string[],
      css: [] as string[],
      js: [] as string[],
      images: [] as string[],
      other: [] as string[]
    };

    const outputDir = path.join(context.workingDir, ".next");

    // 递归收集文件
    const collectFiles = async (dir: string) => {
      const files = await fs.readdir(dir);

      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          await collectFiles(fullPath);
        } else {
          const ext = path.extname(file).toLowerCase();
          const relativePath = path.relative(outputDir, fullPath);

          switch (ext) {
            case ".html":
              assets.html.push(relativePath);
              break;
            case ".css":
              assets.css.push(relativePath);
              break;
            case ".js":
              assets.js.push(relativePath);
              break;
            case ".jpg":
            case ".jpeg":
            case ".png":
            case ".gif":
            case ".svg":
              assets.images.push(relativePath);
              break;
            default:
              assets.other.push(relativePath);
          }
        }
      }
    };

    await collectFiles(outputDir);
    return assets;
  }
}

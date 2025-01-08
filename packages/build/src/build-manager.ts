import path from "path";
import { BuildConfig, BuildContext, BuildResult, BuildProgress } from "./types";
import { BuildStrategy } from "./strategies/build-strategy";
import { NextBuildStrategy } from "./strategies/next-build-strategy";
import { CacheManager } from "./cache-manager";
import { QueueManager } from "./queue-manager";

export class BuildManager {
  private strategies: Map<string, BuildStrategy>;
  private cacheManager: CacheManager;
  private queueManager: QueueManager;

  constructor() {
    this.strategies = new Map();
    this.cacheManager = new CacheManager();
    this.queueManager = new QueueManager();

    // 注册默认的构建策略
    this.registerStrategy("next", new NextBuildStrategy());
  }

  public registerStrategy(type: string, strategy: BuildStrategy): void {
    this.strategies.set(type, strategy);
  }

  private getStrategy(type: string): BuildStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`No build strategy found for type: ${type}`);
    }
    return strategy;
  }

  private createBuildContext(config: BuildConfig): BuildContext {
    const buildId = config.id;
    const baseDir = path.join(process.cwd(), ".build-cache", buildId);

    return {
      buildId,
      config,
      workingDir: path.join(baseDir, "working"),
      outputDir: path.join(baseDir, "output"),
      tempDir: path.join(baseDir, "temp"),
      startTime: Date.now(),
      metadata: {}
    };
  }

  public async build(config: BuildConfig): Promise<BuildResult> {
    try {
      // 1. 获取构建策略
      const strategy = this.getStrategy(config.type);
      const context = this.createBuildContext(config);

      // 2. 检查缓存
      const cacheHash = await strategy.getHash(context);
      const cachedResult = await this.cacheManager.get(cacheHash);
      if (cachedResult) {
        return {
          ...cachedResult.result,
          cached: true
        };
      }

      // 3. 检查构建队列
      const queuedItem = this.queueManager.getItem(config.id);
      if (queuedItem) {
        return {
          success: false,
          buildId: config.id,
          cached: false,
          error: new Error("Build already in queue"),
          duration: 0
        };
      }

      // 4. 添加到构建队列
      const onProgress = (progress: BuildProgress) => {
        this.queueManager.updateProgress(config.id, progress);
      };

      // 5. 执行构建流程
      await strategy.validate(context);
      await strategy.prepare(context);

      const result = await strategy.execute(context, onProgress);

      // 6. 缓存构建结果
      await this.cacheManager.set(cacheHash, {
        buildId: config.id,
        result,
        timestamp: Date.now(),
        hash: cacheHash
      });

      // 7. 清理
      await strategy.cleanup(context);

      return result;
    } catch (error) {
      // 错误处理
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Build failed for ${config.id}:`, errorMessage);

      return {
        success: false,
        buildId: config.id,
        error: error instanceof Error ? error : new Error(errorMessage),
        duration: 0,
        cached: false
      };
    }
  }

  public async cleanupBuild(buildId: string): Promise<void> {
    // 从队列中移除
    this.queueManager.removeItem(buildId);

    // 清理构建目录
    const baseDir = path.join(process.cwd(), ".build-cache", buildId);
    await this.cacheManager.cleanup(baseDir);
  }

  public getBuildProgress(buildId: string): BuildProgress | null {
    const queueItem = this.queueManager.getItem(buildId);
    return queueItem?.progress || null;
  }

  public async cancelBuild(buildId: string): Promise<void> {
    const queueItem = this.queueManager.getItem(buildId);
    if (queueItem) {
      await this.cleanupBuild(buildId);
    }
  }
}

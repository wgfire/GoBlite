import { BuildConfig, BuildContext, BuildResult, BuildProgress } from "./types";
import { NextBuildStrategy } from "./strategies/next-build-strategy";
import { CacheManager } from "./cache-manager";
import { QueueManager } from "./queue-manager";
import { PostBuildManager } from "./post-build/post-build-manager";

export class BuildManager {
  private nextStrategy: NextBuildStrategy;
  private postBuildManager: PostBuildManager;
  private cacheManager: CacheManager;
  private queueManager: QueueManager;

  constructor() {
    this.nextStrategy = new NextBuildStrategy();
    this.postBuildManager = new PostBuildManager();
    this.cacheManager = new CacheManager();
    this.queueManager = new QueueManager();
  }

  private async createBuildContext(buildId: string, config: BuildConfig): Promise<BuildContext> {
    return {
      buildId,
      config,
      startTime: Date.now(),
      metadata: {}
    };
  }

  public async build(config: BuildConfig): Promise<BuildResult> {
    try {
      const context = await this.createBuildContext(config.id, config);

      // 1. 检查构建队列
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

      // 2. 添加到构建队列并设置初始进度
      const onProgress = (progress: BuildProgress) => {
        this.queueManager.updateProgress(config.id, progress);
      };

      // 4. 验证构建环境
      await this.nextStrategy.validate(context);

      // 5. 检查缓存
      const cacheHash = await this.nextStrategy.getHash(context);
      const cachedResult = await this.cacheManager.get(cacheHash);
      if (cachedResult) {
        return {
          ...cachedResult.result,
          cached: true
        };
      }

      // 6. Next.js 构建阶段
      await this.nextStrategy.prepare(context);
      const nextResult = await this.nextStrategy.execute(context, onProgress);

      if (!nextResult.success) {
        return nextResult;
      }

      // 7. 后处理阶段
      const postBuildResult = await this.postBuildManager.process(config.type, context, nextResult);

      // 8. 缓存构建结果
      const finalResult = {
        ...nextResult,
        ...postBuildResult,
        buildId: config.id,
        duration: Date.now() - context.startTime
      };

      await this.cacheManager.set(cacheHash, {
        buildId: config.id,
        result: finalResult,
        timestamp: Date.now(),
        hash: cacheHash
      });

      // 9. 清理
      await this.nextStrategy.cleanup(context);

      return finalResult;
    } catch (error) {
      // 确保在出错时也能清理
      console.error("Error during build:", error);
      try {
        const context = await this.createBuildContext(config.id, config);
        await this.nextStrategy.cleanup(context);
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }

      return {
        success: false,
        buildId: config.id,
        error: error instanceof Error ? error : new Error(String(error)),
        duration: Date.now() - (await this.createBuildContext(config.id, config)).startTime,
        cached: false
      };
    }
  }

  public async cancelBuild(buildId: string): Promise<void> {
    try {
      // 创建一个临时的构建上下文用于清理
      const context = await this.createBuildContext(buildId, { id: buildId, type: "email" });
      await this.nextStrategy.cleanup(context);
    } catch (error) {
      console.error("Error during build cancellation:", error);
    } finally {
      this.queueManager.removeItem(buildId);
    }
  }

  public getBuildProgress(buildId: string): BuildProgress | null {
    const item = this.queueManager.getItem(buildId);
    return item?.progress || null;
  }
}

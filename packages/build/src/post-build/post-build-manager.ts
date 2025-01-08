import { BuildContext, BuildResult } from "../types";
import { PostBuildStrategy } from "./post-build-strategy";
import { EmailPostBuildStrategy } from "./email-post-build";
import { ActivityPostBuildStrategy } from "./activity-post-build";
import { LandingPostBuildStrategy } from "./landing-post-build";

export class PostBuildManager {
  private strategies: Map<string, PostBuildStrategy>;

  constructor() {
    this.strategies = new Map();
    this.registerDefaultStrategies();
  }

  private registerDefaultStrategies(): void {
    this.strategies.set("email", new EmailPostBuildStrategy());
    this.strategies.set("activity", new ActivityPostBuildStrategy());
    this.strategies.set("landing", new LandingPostBuildStrategy());
  }

  public registerStrategy(type: string, strategy: PostBuildStrategy): void {
    this.strategies.set(type, strategy);
  }

  public async process(type: string, context: BuildContext, buildResult: BuildResult): Promise<BuildResult> {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`No post-build strategy found for type: ${type}`);
    }

    try {
      // 验证后处理条件
      const isValid = await strategy.validate(context);
      if (!isValid) {
        throw new Error(`Post-build validation failed for type: ${type}`);
      }

      // 执行后处理
      return await strategy.process(context, buildResult);
    } catch (error) {
      console.error(`Post-build processing failed for type ${type}:`, error);
      throw error;
    }
  }

  public hasStrategy(type: string): boolean {
    return this.strategies.has(type);
  }

  public getAvailableTypes(): string[] {
    return Array.from(this.strategies.keys());
  }
}

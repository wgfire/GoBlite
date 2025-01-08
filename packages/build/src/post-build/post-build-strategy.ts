import { BuildContext, BuildResult } from "../types";

export interface PostBuildStrategy {
  process(context: BuildContext, buildResult: BuildResult): Promise<BuildResult>;
  validate(context: BuildContext): Promise<boolean>;
}

export abstract class BasePostBuildStrategy implements PostBuildStrategy {
  abstract process(context: BuildContext, buildResult: BuildResult): Promise<BuildResult>;

  async validate(): Promise<boolean> {
    return true;
  }

  protected async cleanupAssets(buildResult: BuildResult): Promise<void> {
    // 清理资源的通用方法
    if (buildResult.assets) {
      // 可以在这里添加通用的资源清理逻辑
    }
  }

  protected async injectAssets(
    buildResult: BuildResult,
    assets: {
      styles?: string[];
      scripts?: string[];
    }
  ): Promise<void> {
    if (buildResult.assets) {
      if (assets.styles) {
        buildResult.assets.css = [...(buildResult.assets.css || []), ...assets.styles];
      }
      if (assets.scripts) {
        buildResult.assets.js = [...(buildResult.assets.js || []), ...assets.scripts];
      }
    }
  }
}

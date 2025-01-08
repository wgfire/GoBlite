import { BuildContext, BuildResult, BuildProgress } from "../types";

export interface BuildStrategy {
  prepare(context: BuildContext): Promise<void>;
  execute(context: BuildContext, onProgress?: (progress: BuildProgress) => void): Promise<BuildResult>;
  cleanup(context: BuildContext): Promise<void>;
  validate(context: BuildContext): Promise<boolean>;
  getHash(context: BuildContext): Promise<string>;
}

export abstract class BaseBuildStrategy implements BuildStrategy {
  protected async createProgressUpdate(
    context: BuildContext,
    stage: BuildProgress["stage"],
    progress: number,
    message?: string
  ): Promise<BuildProgress> {
    return {
      buildId: context.buildId,
      stage,
      progress,
      message
    };
  }

  abstract prepare(context: BuildContext): Promise<void>;
  abstract execute(context: BuildContext, onProgress?: (progress: BuildProgress) => void): Promise<BuildResult>;
  abstract cleanup(context: BuildContext): Promise<void>;
  abstract validate(context: BuildContext): Promise<boolean>;
  abstract getHash(context: BuildContext): Promise<string>;
}

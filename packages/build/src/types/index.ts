import { NextConfig } from "next";

export interface BuildConfig {
  id: string;
  type: string;
  nextConfig?: NextConfig;
  outputPath?: string;
  assets?: {
    styles?: string[];
    scripts?: string[];
  };
  optimization?: {
    minify?: boolean;
    compress?: boolean;
    splitChunks?: boolean;
    keepWorkingDir?: boolean;
  };
}

export interface BuildContext {
  buildId: string;
  config: BuildConfig;
  workingDir: string;
  outputDir: string;
  tempDir: string;
  startTime: number;
  metadata: Record<string, unknown>;
}

export interface BuildResult {
  success: boolean;
  buildId: string;
  outputPath?: string;
  error?: Error;
  duration: number;
  cached: boolean;
  assets?: {
    html?: string[];
    css?: string[];
    js?: string[];
    images?: string[];
    other?: string[];
  };
  metrics?: BuildMetrics;
}

export interface BuildMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
  };
  cpu: {
    user: number;
    system: number;
  };
}

export interface BuildProgress {
  buildId: string;
  stage: BuildStage;
  progress: number;
  message?: string;
  error?: Error;
}

export type BuildStage =
  | "initializing"
  | "preparing"
  | "building"
  | "optimizing"
  | "packaging"
  | "cleaning"
  | "completed"
  | "failed";

export interface CacheEntry {
  buildId: string;
  result: BuildResult;
  timestamp: number;
  hash: string;
  dependencies?: Record<string, string>;
}

export interface QueueItem {
  buildId: string;
  priority: number;
  config: BuildConfig;
  status: "queued" | "processing" | "completed" | "failed";
  progress: BuildProgress;
  timestamp: number;
  error?: Error;
  retryCount: number;
}

export type BuildEventData = {
  start: {
    startTime: number;
  };
  progress: BuildProgress;
  complete: BuildMetrics;
  error: {
    error: string;
    stack?: string;
  };
};

export interface BuildEvent {
  buildId: string;
  timestamp: number;
  type: keyof BuildEventData;
  data: BuildEventData[keyof BuildEventData];
}

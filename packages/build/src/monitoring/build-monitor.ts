import { EventEmitter } from "events";
import { BuildProgress, BuildMetrics, BuildEvent } from "../types";

export class BuildMonitor extends EventEmitter {
  private metrics: Map<string, BuildMetrics>;
  private startTimes: Map<string, number>;
  private logs: Map<string, BuildEvent[]>;

  constructor() {
    super();
    this.metrics = new Map();
    this.startTimes = new Map();
    this.logs = new Map();
  }

  public startBuild(buildId: string): void {
    const startTime = Date.now();
    this.startTimes.set(buildId, startTime);
    this.logs.set(buildId, []);

    const event: BuildEvent = {
      buildId,
      timestamp: startTime,
      type: "start",
      data: { startTime }
    };

    this.logEvent(buildId, event);
    this.emit("buildStart", event);
  }

  public updateProgress(buildId: string, progress: BuildProgress): void {
    const event: BuildEvent = {
      buildId,
      timestamp: Date.now(),
      type: "progress",
      data: progress
    };

    this.logEvent(buildId, event);
    this.emit("buildProgress", event);
  }

  public completeBuild(buildId: string, metrics: BuildMetrics): void {
    this.metrics.set(buildId, metrics);

    const event: BuildEvent = {
      buildId,
      timestamp: Date.now(),
      type: "complete",
      data: metrics
    };

    this.logEvent(buildId, event);
    this.emit("buildComplete", event);
  }

  public errorBuild(buildId: string, error: Error): void {
    const event: BuildEvent = {
      buildId,
      timestamp: Date.now(),
      type: "error",
      data: {
        error: error.message,
        stack: error.stack
      }
    };

    this.logEvent(buildId, event);
    this.emit("buildError", event);
  }

  public getBuildMetrics(buildId: string): BuildMetrics | undefined {
    return this.metrics.get(buildId);
  }

  public getBuildLogs(buildId: string): BuildEvent[] {
    return this.logs.get(buildId) || [];
  }

  public getBuildDuration(buildId: string): number {
    const startTime = this.startTimes.get(buildId);
    if (!startTime) return 0;

    const metrics = this.metrics.get(buildId);
    return metrics ? metrics.duration : Date.now() - startTime;
  }

  private logEvent(buildId: string, event: BuildEvent): void {
    const buildLogs = this.logs.get(buildId) || [];
    buildLogs.push(event);
    this.logs.set(buildId, buildLogs);
  }

  public cleanup(buildId: string): void {
    this.metrics.delete(buildId);
    this.startTimes.delete(buildId);
    this.logs.delete(buildId);
  }
}

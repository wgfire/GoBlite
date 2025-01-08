import fs from "fs-extra";
import path from "path";
import { BuildEvent, BuildEventData } from "../types";

export class Logger {
  private logDir: string;
  private buildLogs: Map<string, string[]>;

  constructor(options: { logDir?: string } = {}) {
    this.logDir = options.logDir || path.join(process.cwd(), "logs");
    this.buildLogs = new Map();
    this.initializeLogger();
  }

  private initializeLogger(): void {
    fs.ensureDirSync(this.logDir);
  }

  public log(buildId: string, message: string, level: "info" | "warn" | "error" = "info"): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    // 内存中保存日志
    const logs = this.buildLogs.get(buildId) || [];
    logs.push(logEntry);
    this.buildLogs.set(buildId, logs);

    // 写入文件
    const logFile = path.join(this.logDir, `${buildId}.log`);
    fs.appendFileSync(logFile, logEntry + "\n");

    // 控制台输出
    console[level](logEntry);
  }

  public logEvent(event: BuildEvent): void {
    const { buildId, type, data } = event;

    switch (type) {
      case "start": {
        const startData = data as BuildEventData["start"];
        const message = `Build started at ${new Date(startData.startTime).toISOString()}`;
        this.log(buildId, message, "info");
        break;
      }

      case "progress": {
        const progressData = data as BuildEventData["progress"];
        const message = `Build progress: ${progressData.stage} (${progressData.progress}%) ${progressData.message || ""}`;
        this.log(buildId, message, "info");
        break;
      }

      case "complete": {
        const metricsData = data as BuildEventData["complete"];
        const message = `Build completed in ${metricsData.duration}ms`;
        this.log(buildId, message, "info");
        break;
      }

      case "error": {
        const errorData = data as BuildEventData["error"];
        const message = `Build failed: ${errorData.error}\n${errorData.stack || ""}`;
        this.log(buildId, message, "error");
        break;
      }
    }
  }

  public getBuildLogs(buildId: string): string[] {
    return this.buildLogs.get(buildId) || [];
  }

  public async getLogFile(buildId: string): Promise<string | null> {
    const logFile = path.join(this.logDir, `${buildId}.log`);
    if (await fs.pathExists(logFile)) {
      return fs.readFile(logFile, "utf-8");
    }
    return null;
  }

  public async cleanup(buildId: string): Promise<void> {
    // 清理内存中的日志
    this.buildLogs.delete(buildId);

    // 清理日志文件
    const logFile = path.join(this.logDir, `${buildId}.log`);
    if (await fs.pathExists(logFile)) {
      await fs.remove(logFile);
    }
  }

  public async cleanupOldLogs(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now();
    const files = await fs.readdir(this.logDir);

    for (const file of files) {
      const logFile = path.join(this.logDir, file);
      const stats = await fs.stat(logFile);

      if (now - stats.mtimeMs > maxAge) {
        await fs.remove(logFile);
      }
    }
  }
}

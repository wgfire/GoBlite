import { QueueItem, BuildProgress } from "./types";

interface QueueOptions {
  maxConcurrent?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export class QueueManager {
  private queue: Map<string, QueueItem>;
  private processing: Set<string>;
  private maxConcurrent: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor(options: QueueOptions = {}) {
    this.queue = new Map();
    this.processing = new Set();
    this.maxConcurrent = options.maxConcurrent || 1;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 5000;
  }

  public getItem(buildId: string): QueueItem | undefined {
    return this.queue.get(buildId);
  }

  public addItem(item: Omit<QueueItem, "status" | "progress" | "timestamp" | "retryCount">): void {
    const queueItem: QueueItem = {
      ...item,
      status: "queued",
      progress: {
        buildId: item.buildId,
        stage: "initializing",
        progress: 0
      },
      timestamp: Date.now(),
      retryCount: 0
    };
    if (this.queue.has(queueItem.buildId)) {
      throw new Error(`Build ${queueItem.buildId} already exists in queue`);
    }
    this.queue.set(queueItem.buildId, queueItem);
  }

  public removeItem(buildId: string): void {
    this.queue.delete(buildId);
    this.processing.delete(buildId);
  }

  public updateProgress(buildId: string, progress: BuildProgress): void {
    const item = this.queue.get(buildId);
    if (item) {
      item.progress = progress;
      this.queue.set(buildId, item);
    }
  }

  public async processQueue(): Promise<void> {
    // 获取所有等待中的项目
    const waitingItems = Array.from(this.queue.values())
      .filter(item => item.status === "queued")
      .sort((a, b) => b.priority - a.priority);

    // 检查是否可以处理新的项目
    while (this.processing.size < this.maxConcurrent && waitingItems.length > 0) {
      const item = waitingItems.shift();
      if (item) {
        await this.processItem(item);
      }
    }
  }

  private async processItem(item: QueueItem): Promise<void> {
    if (this.processing.has(item.buildId)) {
      return;
    }

    this.processing.add(item.buildId);
    item.status = "processing";
    this.queue.set(item.buildId, item);

    try {
      // 这里实际的处理逻辑由外部处理
      // 我们只负责状态管理
      item.status = "completed";
    } catch (error) {
      item.status = "failed";
      item.error = error instanceof Error ? error : new Error(String(error));

      // 重试逻辑
      if (item.retryCount < this.maxRetries) {
        item.retryCount += 1;
        item.status = "queued";
        setTimeout(() => {
          this.processQueue();
        }, this.retryDelay);
      }
    } finally {
      this.processing.delete(item.buildId);
      this.queue.set(item.buildId, item);
    }
  }

  public getQueueStats() {
    const items = Array.from(this.queue.values());
    return {
      total: items.length,
      queued: items.filter(item => item.status === "queued").length,
      processing: items.filter(item => item.status === "processing").length,
      completed: items.filter(item => item.status === "completed").length,
      failed: items.filter(item => item.status === "failed").length
    };
  }

  public clear(): void {
    this.queue.clear();
    this.processing.clear();
  }

  public clearCompleted(): void {
    for (const [buildId, item] of this.queue.entries()) {
      if (item.status === "completed" || item.status === "failed") {
        this.removeItem(buildId);
      }
    }
  }

  public getPendingItems(): QueueItem[] {
    return Array.from(this.queue.values())
      .filter(item => item.status === "queued")
      .sort((a, b) => b.priority - a.priority);
  }

  public getProcessingItems(): QueueItem[] {
    return Array.from(this.queue.values()).filter(item => item.status === "processing");
  }
}

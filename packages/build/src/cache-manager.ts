import fs from "fs-extra";
import path from "path";
import { CacheEntry } from "./types";

export class CacheManager {
  private cacheDir: string;
  private cacheMap: Map<string, CacheEntry>;
  private maxAge: number;

  constructor(options: { cacheDir?: string; maxAge?: number } = {}) {
    this.cacheDir = options.cacheDir || path.join(process.cwd(), ".build-cache");
    this.maxAge = options.maxAge || 24 * 60 * 60 * 1000; // 默认24小时
    this.cacheMap = new Map();

    // 确保缓存目录存在
    fs.ensureDirSync(this.cacheDir);
    this.loadCache();
  }

  private async loadCache(): Promise<void> {
    try {
      const cacheFile = path.join(this.cacheDir, "cache.json");
      if (await fs.pathExists(cacheFile)) {
        const data = await fs.readJson(cacheFile);
        Object.entries(data).forEach(([hash, entry]) => {
          this.cacheMap.set(hash, entry as CacheEntry);
        });
      }
    } catch (error) {
      console.error("Failed to load cache:", error);
    }
  }

  private async saveCache(): Promise<void> {
    try {
      const cacheFile = path.join(this.cacheDir, "cache.json");
      const data = Object.fromEntries(this.cacheMap.entries());
      await fs.writeJson(cacheFile, data, { spaces: 2 });
    } catch (error) {
      console.error("Failed to save cache:", error);
    }
  }

  public async get(hash: string): Promise<CacheEntry | null> {
    const entry = this.cacheMap.get(hash);
    if (!entry) {
      return null;
    }

    // 检查缓存是否过期
    if (Date.now() - entry.timestamp > this.maxAge) {
      await this.invalidate(hash);
      return null;
    }

    // 验证缓存文件是否存在
    const outputPath = entry.result.outputPath;
    if (outputPath && !(await fs.pathExists(outputPath))) {
      await this.invalidate(hash);
      return null;
    }

    return entry;
  }

  public async set(hash: string, entry: CacheEntry): Promise<void> {
    this.cacheMap.set(hash, entry);
    await this.saveCache();

    // 清理过期缓存
    await this.cleanup();
  }

  public async invalidate(hash: string): Promise<void> {
    const entry = this.cacheMap.get(hash);
    if (entry) {
      // 删除缓存文件
      if (entry.result.outputPath) {
        try {
          await fs.remove(entry.result.outputPath);
        } catch (error) {
          console.error(`Failed to remove cache files for ${hash}:`, error);
        }
      }

      // 从缓存映射中删除
      this.cacheMap.delete(hash);
      await this.saveCache();
    }
  }

  public async cleanup(targetDir?: string): Promise<void> {
    const now = Date.now();

    // 清理指定目录
    if (targetDir && (await fs.pathExists(targetDir))) {
      await fs.remove(targetDir);
      return;
    }

    // 清理过期缓存
    const expiredHashes: string[] = [];
    this.cacheMap.forEach((entry, hash) => {
      if (now - entry.timestamp > this.maxAge) {
        expiredHashes.push(hash);
      }
    });

    await Promise.all(expiredHashes.map(hash => this.invalidate(hash)));
  }

  public async clear(): Promise<void> {
    // 清空缓存映射
    this.cacheMap.clear();
    await this.saveCache();

    // 删除缓存目录
    await fs.emptyDir(this.cacheDir);
  }

  public getStats(): { total: number; size: number } {
    return {
      total: this.cacheMap.size,
      size: Array.from(this.cacheMap.values()).reduce((acc, entry) => {
        return acc + (entry.result.outputPath ? fs.statSync(entry.result.outputPath).size : 0);
      }, 0)
    };
  }
}

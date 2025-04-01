import { FileSystemTree, DirectoryNode } from "@webcontainer/api";

/**
 * 依赖缓存项接口
 */
export interface DependencyCacheItem {
  nodeModulesSnapshot: DirectoryNode; // node_modules快照
  timestamp: number; // 缓存创建时间
}

/**
 * 依赖缓存管理类
 *
 * 负责管理WebContainer依赖的缓存，提高模板切换时的构建速度
 */
export class DependencyCache {
  private static instance: DependencyCache | null = null;
  private cache: Map<string, DependencyCacheItem> = new Map();
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24小时

  private constructor() {}

  /**
   * 获取DependencyCache实例（单例模式）
   */
  public static getInstance(): DependencyCache {
    if (!DependencyCache.instance) {
      DependencyCache.instance = new DependencyCache();
    }
    return DependencyCache.instance;
  }

  /**
   * 生成缓存键
   * @param content package.json的内容
   */
  public generateCacheKey(content: string): string {
    return content;
  }

  /**
   * 检查是否有缓存
   * @param key 缓存键
   */
  public hasCache(key: string): boolean {
    const data = this.cache.get(key);
    if (!data) return false;

    // 检查缓存是否过期
    if (Date.now() - data.timestamp > this.CACHE_EXPIRY) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 获取缓存
   * @param key 缓存键
   */
  public getCache(key: string): DependencyCacheItem | null {
    const data = this.cache.get(key);
    if (!data) return null;

    // 检查缓存是否过期
    if (Date.now() - data.timestamp > this.CACHE_EXPIRY) {
      this.cache.delete(key);
      return null;
    }

    return data;
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param nodeModulesDir node_modules目录内容
   */
  public setCache(key: string, nodeModulesDir: any): void {
    try {
      // 验证node_modules目录内容
      if (!nodeModulesDir || !Array.isArray(nodeModulesDir)) {
        console.error("无效的node_modules目录内容");
        return;
      }

      // 将目录内容转换为DirectoryNode格式
      const snapshot = this.convertToDirectoryNode(nodeModulesDir);

      // 验证转换后的snapshot
      if (!snapshot || !snapshot.directory) {
        console.error("转换后的DirectoryNode无效");
        return;
      }

      // 设置缓存
      this.cache.set(key, {
        nodeModulesSnapshot: snapshot,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("设置缓存失败:", error);
    }
  }

  /**
   * 将目录内容转换为DirectoryNode格式
   * @param dirContent 目录内容
   */
  private convertToDirectoryNode(dirContent: any): DirectoryNode {
    const tree: FileSystemTree = {};

    try {
      for (const item of dirContent) {
        if (!item || typeof item !== "object") continue;

        const name = item.name;
        if (!name) continue;

        if (item.isDirectory()) {
          // 如果是目录，递归处理
          const subNode = this.convertToDirectoryNode(item.children || []);
          tree[name] = subNode;
        } else {
          // 如果是文件，创建文件节点
          tree[name] = {
            file: {
              contents: item.content || "",
            },
          };
        }
      }
    } catch (error) {
      console.error("转换DirectoryNode失败:", error);
    }

    return { directory: tree };
  }

  /**
   * 清除所有缓存
   */
  public clearCache(): void {
    this.cache.clear();
  }
}

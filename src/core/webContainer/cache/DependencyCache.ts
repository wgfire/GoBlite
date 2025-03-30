import { WebContainer } from '@webcontainer/api';

/**
 * 依赖缓存项接口
 */
export interface DependencyCacheItem {
  packageHash: string;        // package.json的哈希值
  nodeModulesSnapshot: any;   // node_modules快照
  timestamp: number;          // 缓存创建时间
}

/**
 * 依赖缓存管理类
 * 
 * 负责管理WebContainer依赖的缓存，提高模板切换时的构建速度
 */
export class DependencyCache {
  private static instance: DependencyCache | null = null;
  private cacheMap: Map<string, any> = new Map();
  
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
   * @param packageJson package.json内容
   */
  public generateCacheKey(packageJson: string): string {
    // 简单实现：使用packageJson的哈希作为缓存键
    let hash = 0;
    for (let i = 0; i < packageJson.length; i++) {
      const char = packageJson.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return `dep_cache_${hash}`;
  }
  
  /**
   * 检查是否有缓存
   * @param cacheKey 缓存键
   */
  public hasCache(cacheKey: string): boolean {
    return this.cacheMap.has(cacheKey);
  }
  
  /**
   * 获取缓存
   * @param cacheKey 缓存键
   */
  public getCache(cacheKey: string): any {
    return this.cacheMap.get(cacheKey);
  }
  
  /**
   * 设置缓存
   * @param cacheKey 缓存键
   * @param nodeModules node_modules数据
   */
  public setCache(cacheKey: string, nodeModules: any): void {
    this.cacheMap.set(cacheKey, {
      nodeModulesSnapshot: nodeModules,
      timestamp: Date.now()
    });
  }
  
  /**
   * 清除所有缓存
   */
  public clearCache(): void {
    this.cacheMap.clear();
  }
}

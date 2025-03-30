/**
 * 缓存工具类
 * 
 * 提供与缓存相关的辅助函数
 */
export class CacheUtils {
  /**
   * 计算字符串的哈希值
   * @param str 要计算哈希的字符串
   * @returns 哈希值
   */
  public static calculateHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    
    return hash.toString();
  }
  
  /**
   * 检查缓存是否过期
   * @param timestamp 缓存创建时间戳
   * @param maxAge 最大有效期（毫秒）
   * @returns 是否过期
   */
  public static isCacheExpired(timestamp: number, maxAge: number = 24 * 60 * 60 * 1000): boolean {
    const now = Date.now();
    return now - timestamp > maxAge;
  }
  
  /**
   * 格式化缓存大小
   * @param bytes 字节数
   * @returns 格式化后的大小字符串
   */
  public static formatCacheSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

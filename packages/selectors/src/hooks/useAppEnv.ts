/**
 * 获取当前APP相关的数据，比如token langCode
 */
import { useState, useEffect, useCallback } from "react";

/**
 * 应用环境变量类型定义
 */
export interface AppEnvData {
  /**
   * 牌照
   */
  license?: string;
  /**
   * 语言
   */
  locale?: string;
  /**
   * 登录
   */
  isLogin?: boolean;
  /**
   * 版本
   */
  appVersion?: number;
  /**
   * 国家
   */
  nationalityCode?: string;
  /**
   * 边距
   */
  safeAreaHeight?: number;
  /**
   * 行情样式
   */
  quotationStyle?: 0 | 1;
  /**
   *主题
   */
  theme?: "dark" | "light";

  /**
   * token
   */
  sessionToken?: string;

  // 根据实际需求添加更多字段
  [key: string]: unknown;
}

const mockEnvData: AppEnvData = {
  license: "FSC",
  locale: "zh-CN",
  isLogin: true,
  appVersion: 1,
  nationalityCode: "TW",
  safeAreaHeight: 0,
  quotationStyle: 0,
  theme: "light",
  sessionToken: "ADDDXXXXASS"
};
/**
 * 获取当前APP相关的数据，比如token langCode
 * 使用此 hook 可以获取和更新环境变量
 */
export const useAppEnv = () => {
  const [envData, setEnvData] = useState<AppEnvData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 获取环境变量的方法
  const fetchEnvData = useCallback((): Promise<AppEnvData> => {
    return new Promise((resolve, reject) => {
      setLoading(true);

      // 如果 window.getHeader 不存在，则提供 mock 数据
      if (!window.getHeader) {
        console.warn("[useAppEnv] window.getHeader is not defined, using mock data.");
        setEnvData(mockEnvData);
        setLoading(false);
        resolve(mockEnvData);
        return;
      }

      // 调用 window.getHeader 获取环境变量
      window.getHeader((res: Record<string, unknown>) => {
        try {
          // 确保 res 是一个有效的对象
          const envData = res && typeof res === "object" ? res : {};
          setEnvData(envData);
          setError(null);
          resolve(envData);
        } catch (err) {
          const error = err instanceof Error ? err : new Error("获取环境变量失败");
          setError(error);
          reject(error);
        } finally {
          setLoading(false);
        }
      });
    });
  }, []);

  // 刷新环境变量的方法
  const refreshEnv = useCallback(async () => {
    try {
      return await fetchEnvData();
    } catch (err) {
      console.error("刷新环境变量失败:", err);
      return {};
    }
  }, [fetchEnvData]);

  // 在组件挂载时获取环境变量
  useEffect(() => {
    fetchEnvData().catch(err => {
      console.error("初始化环境变量失败:", err);
    });
  }, [fetchEnvData]);

  return {
    envData,
    loading,
    error,
    refreshEnv
  };
};

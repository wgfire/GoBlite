import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { 
  webContainerUtils, 
  FileSystemTree, 
  BuildStatus,
  BuildProcessInfo,
  EventType,
  eventBus 
} from '@vite-goblite/core';

// WebContainer上下文接口
interface WebContainerContextProps {
  isInitialized: boolean;
  isLoading: boolean;
  buildInfo: BuildProcessInfo;
  serverUrl: string | null;
  initialize: () => Promise<void>;
  loadFiles: (files: FileSystemTree) => Promise<void>;
  installDependencies: () => Promise<void>;
  startDevServer: () => Promise<string>;
  buildProject: () => Promise<void>;
  restartDevServer: () => Promise<string>;
  setTerminal: (terminal: any) => void;
}

// 创建WebContainer上下文
const WebContainerContext = createContext<WebContainerContextProps | undefined>(undefined);

// WebContainerProvider接口
interface WebContainerProviderProps {
  children: ReactNode;
}

/**
 * WebContainer Provider组件
 * 提供WebContainer相关功能的上下文
 */
export const WebContainerProvider: React.FC<WebContainerProviderProps> = ({ children }) => {
  // 状态
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buildInfo, setBuildInfo] = useState<BuildProcessInfo>(webContainerUtils.getBuildInfo());
  const [serverUrl, setServerUrl] = useState<string | null>(null);

  // 初始化WebContainer
  const initialize = useCallback(async () => {
    if (isInitialized) return;
    
    setIsLoading(true);
    try {
      await webContainerUtils.initialize();
      setIsInitialized(true);
    } catch (error) {
      console.error('初始化WebContainer失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // 加载文件到WebContainer
  const loadFiles = useCallback(async (files: FileSystemTree) => {
    setIsLoading(true);
    try {
      await webContainerUtils.loadFiles(files);
    } catch (error) {
      console.error('加载文件失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 安装依赖
  const installDependencies = useCallback(async () => {
    setIsLoading(true);
    try {
      await webContainerUtils.installDependencies();
    } catch (error) {
      console.error('安装依赖失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 启动开发服务器
  const startDevServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = await webContainerUtils.startDevServer();
      setServerUrl(url);
      return url;
    } catch (error) {
      console.error('启动开发服务器失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 构建项目
  const buildProject = useCallback(async () => {
    setIsLoading(true);
    try {
      await webContainerUtils.buildProject();
    } catch (error) {
      console.error('构建项目失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 重启开发服务器
  const restartDevServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = await webContainerUtils.restartDevServer();
      setServerUrl(url);
      return url;
    } catch (error) {
      console.error('重启开发服务器失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 设置终端
  const setTerminal = useCallback((terminal: any) => {
    webContainerUtils.setTerminal(terminal);
  }, []);

  // 监听构建信息更新
  useEffect(() => {
    const updateBuildInfo = () => {
      setBuildInfo(webContainerUtils.getBuildInfo());
    };

    // 注册事件监听
    eventBus.on(EventType.BUILD_STARTED, updateBuildInfo);
    eventBus.on(EventType.BUILD_COMPLETED, updateBuildInfo);
    eventBus.on(EventType.BUILD_FAILED, updateBuildInfo);
    eventBus.on(EventType.SERVER_STARTED, (data: { url: string }) => {
      setServerUrl(data.url);
      updateBuildInfo();
    });
    eventBus.on(EventType.DEPENDENCIES_INSTALLED, updateBuildInfo);

    // 清除事件监听
    return () => {
      eventBus.off(EventType.BUILD_STARTED, updateBuildInfo);
      eventBus.off(EventType.BUILD_COMPLETED, updateBuildInfo);
      eventBus.off(EventType.BUILD_FAILED, updateBuildInfo);
      eventBus.off(EventType.SERVER_STARTED, updateBuildInfo);
      eventBus.off(EventType.DEPENDENCIES_INSTALLED, updateBuildInfo);
    };
  }, []);

  // 构建上下文值
  const contextValue: WebContainerContextProps = {
    isInitialized,
    isLoading,
    buildInfo,
    serverUrl,
    initialize,
    loadFiles,
    installDependencies,
    startDevServer,
    buildProject,
    restartDevServer,
    setTerminal
  };

  return (
    <WebContainerContext.Provider value={contextValue}>
      {children}
    </WebContainerContext.Provider>
  );
};

/**
 * 使用WebContainer的hook
 * 提供WebContainer的状态和方法
 */
export const useWebContainer = (): WebContainerContextProps => {
  const context = useContext(WebContainerContext);
  if (!context) {
    throw new Error('useWebContainer必须在WebContainerProvider内部使用');
  }
  return context;
};

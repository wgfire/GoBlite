import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { webContainerStatusAtom, previewUrlAtom, errorMessageAtom, webContainerVisibleAtom, terminalExpandedAtom } from "@core/webContainer/atoms";
import { WebContainerStatus } from "@core/webContainer/types";
import { WebContainerService } from "@/core/webContainer/services/WebContainerService";
import { FileItem } from "@core/fileSystem/types";

/**
 * WebContainer核心功能Hook
 *
 * 提供WebContainer的状态管理和核心操作方法
 */
export const useWebContainer = () => {
  // 状态管理
  const [status, setStatus] = useAtom(webContainerStatusAtom);
  const [previewUrl, setPreviewUrl] = useAtom(previewUrlAtom);
  const [error, setError] = useAtom(errorMessageAtom);
  const [isVisible, setIsVisible] = useAtom(webContainerVisibleAtom);
  const [isTerminalExpanded, setIsTerminalExpanded] = useAtom(terminalExpandedAtom);

  // WebContainerService实例引用
  const serviceRef = useRef<WebContainerService | null>(null);

  // 确保只创建一个服务实例
  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = WebContainerService.getInstance();
    }

    // 移除组件卸载时停止服务的逻辑，保持服务持续运行
    return () => {
      // 不再停止服务，允许在视图切换时保持状态
      // if (serviceRef.current) {
      //   serviceRef.current.stop();
      // }
    };
  }, []);

  /**
   * 初始化WebContainer
   */
  const initialize = useCallback(async () => {
    try {
      setStatus(WebContainerStatus.INITIALIZING);

      // 确保服务实例存在
      if (!serviceRef.current) {
        serviceRef.current = WebContainerService.getInstance();
      }

      // 调用服务初始化方法
      const success = await serviceRef.current.initialize();

      if (success) {
        // 初始化成功
        setStatus(WebContainerStatus.RUNNING);
        setError(null);
        return true;
      } else {
        // 初始化失败
        setStatus(WebContainerStatus.ERROR);
        setError(serviceRef.current.getError() || "初始化失败");
        return false;
      }
    } catch (err) {
      // 初始化失败
      setStatus(WebContainerStatus.ERROR);
      setError(err instanceof Error ? err.message : "初始化失败");
      return false;
    }
  }, [setStatus, setError]);

  /**
   * 同步文件到WebContainer
   * @param files 文件列表
   */
  const syncFiles = useCallback(
    async (files: FileItem[]) => {
      if (!serviceRef.current) {
        throw new Error("WebContainer服务未初始化");
      }

      try {
        await serviceRef.current.syncFiles(files);
        return true;
      } catch (err) {
        console.error("同步文件失败:", err);
        setError(err instanceof Error ? err.message : "同步文件失败");
        return false;
      }
    },
    [setError]
  );

  /**
   * 启动应用
   * @param files 文件列表
   */
  const startApp = useCallback(
    async (files: FileItem[]) => {
      try {
        // 清空之前的错误信息
        setError(null);

        // 重置预览URL
        setPreviewUrl("");

        // 1. 初始化WebContainer（如果尚未初始化）
        if (status !== WebContainerStatus.RUNNING) {
          console.log("正在初始化WebContainer...");
          const initSuccess = await initialize();
          if (!initSuccess) {
            throw new Error("初始化WebContainer失败");
          }
          console.log("WebContainer初始化成功");
        }

        // 2. 同步文件
        console.log("正在同步文件到WebContainer...");
        const syncSuccess = await syncFiles(files);
        if (!syncSuccess) {
          throw new Error("同步文件失败");
        }
        console.log("文件同步成功");

        // 3. 安装依赖
        if (!serviceRef.current) {
          throw new Error("WebContainer服务未初始化");
        }

        try {
          console.log("正在安装依赖...");
          await serviceRef.current.installDependencies();
          console.log("依赖安装成功");
        } catch (err) {
          console.error("安装依赖失败:", err);
          // 依赖安装失败不一定是致命错误，可以继续尝试启动服务器
        }

        // 4. 启动开发服务器
        console.log("正在启动WebContainer内部开发服务器...");
        const serverUrl = await serviceRef.current.startDevServer();
        if (serverUrl) {
          console.log(`WebContainer内部服务启动成功，URL: ${serverUrl}`);
          setPreviewUrl(serverUrl);
          setStatus(WebContainerStatus.RUNNING);

          // 显示终端，方便用户查看输出
          setIsTerminalExpanded(true);
        } else {
          throw new Error("无法获取WebContainer内部服务URL");
        }

        return true;
      } catch (err) {
        setStatus(WebContainerStatus.ERROR);
        setError(err instanceof Error ? err.message : "启动应用失败");
        console.error("启动应用失败:", err);
        return false;
      }
    },
    [status, initialize, syncFiles, setPreviewUrl, setStatus, setError, setIsTerminalExpanded]
  );

  /**
   * 启动WebContainer服务
   */
  const start = useCallback(
    async (files?: FileItem[]) => {
      if (files) {
        return startApp(files);
      }

      if (status === WebContainerStatus.EMPTY || status === WebContainerStatus.STOPPED) {
        return initialize();
      } else if (status === WebContainerStatus.ERROR) {
        setError(null);
        return initialize();
      }
      return status === WebContainerStatus.RUNNING;
    },
    [status, initialize, startApp, setError]
  );

  /**
   * 停止WebContainer服务
   */
  const stop = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stop();
    }

    if (status === WebContainerStatus.RUNNING) {
      setStatus(WebContainerStatus.STOPPED);
      setPreviewUrl("");
    }
  }, [status, setStatus, setPreviewUrl]);

  /**
   * 重置WebContainer状态
   */
  const reset = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stop();
    }

    setStatus(WebContainerStatus.EMPTY);
    setPreviewUrl("");
    setError(null);
  }, [setStatus, setPreviewUrl, setError]);

  /**
   * 切换WebContainer可见性
   */
  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, [setIsVisible]);

  /**
   * 设置WebContainer可见性
   */
  const setVisibility = useCallback(
    (visible: boolean) => {
      setIsVisible(visible);
    },
    [setIsVisible]
  );

  /**
   * 切换终端展开状态
   */
  const toggleTerminal = useCallback(() => {
    setIsTerminalExpanded((prev) => !prev);
  }, [setIsTerminalExpanded]);

  return {
    status,
    previewUrl,
    error,
    isVisible,
    isTerminalExpanded,
    isEmpty: status === WebContainerStatus.EMPTY,
    isInitializing: status === WebContainerStatus.INITIALIZING,
    isRunning: status === WebContainerStatus.RUNNING,
    isError: status === WebContainerStatus.ERROR,
    isStopped: status === WebContainerStatus.STOPPED,
    initialize,
    syncFiles,
    startApp,
    start,
    stop,
    reset,
    toggleVisibility,
    setVisibility,
    toggleTerminal,
    setIsVisible,
  };
};

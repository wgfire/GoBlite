import { useAtom } from "jotai";
import { useCallback, useRef, useEffect } from "react";
import { previewUrlAtom, previewModeAtom, previewLoadingAtom } from "../atoms";
import { webContainerStatusAtom } from "../atoms";
import { WebContainerStatus, ViewMode } from "../types";
import { WebContainerProxyService } from "../services/WebContainerProxyService";

/**
 * 预览功能Hook
 *
 * 提供预览的状态管理和操作方法
 */
export const usePreview = () => {
  // 状态管理
  const [url, setUrl] = useAtom(previewUrlAtom);
  const [viewMode, setViewMode] = useAtom(previewModeAtom);
  const [isLoading, setIsLoading] = useAtom(previewLoadingAtom);
  const [containerStatus] = useAtom(webContainerStatusAtom);
  // 初始化WebContainer代理服务
  const proxyServiceRef = useRef<WebContainerProxyService | null>(null);
  // 用于跟踪iframe刷新状态
  const refreshCountRef = useRef(0);

  /**
   * 检查URL是否可访问
   * @param urlToCheck 要检查的URL
   * @returns Promise<boolean> 是否可访问
   */
  const checkUrlAccessibility = useCallback(async (urlToCheck: string): Promise<boolean> => {
    try {
      const response = await fetch(urlToCheck, {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-cache",
      });
      console.log("URL访问检查:", response);
      return true;
    } catch (error) {
      console.error("URL访问检查失败:", error);
      return false;
    }
  }, []);

  /**
   * 刷新预览
   * 增强版刷新函数，可以检查WebContainer内部服务的最新状态
   */
  const refresh = useCallback(() => {
    if (containerStatus === WebContainerStatus.RUNNING) {
      setIsLoading(true);

      // 如果已有URL，先尝试简单刷新
      if (url) {
        // 通过更新URL参数来强制iframe刷新
        const refreshCount = ++refreshCountRef.current;
        const urlObj = new URL(url);

        // 添加或更新刷新参数
        urlObj.searchParams.set("refresh", refreshCount.toString());

        // 设置新的URL以触发刷新
        setUrl(urlObj.toString());

        // 尝试检查URL是否可访问
        checkUrlAccessibility(urlObj.toString())
          .then((isAccessible) => {
            if (!isAccessible) {
              console.log("当前URL无法访问，尝试获取新的WebContainer服务URL");
              // 如果当前URL无法访问，尝试获取新的URL
              // 这里我们可以触发一个自定义事件，通知WebContainer组件重新获取URL
              const refreshEvent = new CustomEvent("webcontainer-refresh-needed");
              window.dispatchEvent(refreshEvent);
            } else {
              setIsLoading(false);
            }
          })
          .catch(() => {
            // 如果检查失败，也将加载状态设置为完成
            setIsLoading(false);
          });

        return true;
      } else {
        // 如果没有URL，触发事件请求新的URL
        const refreshEvent = new CustomEvent("webcontainer-refresh-needed");
        window.dispatchEvent(refreshEvent);
        return true;
      }
    }
    return false;
  }, [containerStatus, url, setUrl, setIsLoading, checkUrlAccessibility]);

  /**
   * 更新预览URL
   * @param newUrl 新的URL地址
   */
  const updateUrl = useCallback(
    (newUrl: string) => {
      if (containerStatus === WebContainerStatus.RUNNING) {
        // 验证URL格式
        try {
          // 如果URL没有协议，添加http://
          if (!/^https?:\/\//i.test(newUrl)) {
            newUrl = `http://${newUrl}`;
          }

          // 尝试创建URL对象验证格式
          new URL(newUrl);

          setIsLoading(true);
          setUrl(newUrl);
          return true;
        } catch (error) {
          console.error("无效的URL格式:", error);
          return false;
        }
      }
      return false;
    },
    [containerStatus, setUrl, setIsLoading]
  );

  /**
   * 切换预览模式
   * @param mode 预览模式
   */
  const changeViewMode = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
    },
    [setViewMode]
  );

  // 确保只创建一个代理服务实例
  useEffect(() => {
    if (!proxyServiceRef.current) {
      proxyServiceRef.current = WebContainerProxyService.getInstance();
    }
  }, []);

  /**
   * 在新窗口打开预览
   * 使用WebContainerProxyService解决WebContainer内部URL在外部浏览器中无法访问的问题
   */
  const openInNewWindow = useCallback(() => {
    if (url) {
      // 使用代理服务打开新窗口
      if (proxyServiceRef.current) {
        return proxyServiceRef.current.openInNewWindow(url);
      } else {
        // 如果代理服务不可用，则使用原始方式打开
        // 不使用noopener，以确保可以通过window.opener通信
        window.open(url, "_blank");
        return true;
      }
    }
    return false;
  }, [url]);

  /**
   * 处理iframe加载完成
   */
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  /**
   * 获取预览尺寸
   * @returns 预览尺寸对象
   */
  const getPreviewSize = useCallback((): { width: string | number; height: string } => {
    switch (viewMode) {
      case "mobile":
        return { width: 375, height: "100%" };
      case "tablet":
        return { width: 768, height: "100%" };
      case "desktop":
      default:
        return { width: "100%", height: "100%" };
    }
  }, [viewMode]);

  return {
    url,
    viewMode,
    isLoading,
    isRunning: containerStatus === WebContainerStatus.RUNNING,
    refresh,
    updateUrl,
    changeViewMode,
    openInNewWindow,
    handleIframeLoad,
    getPreviewSize,
    checkUrlAccessibility
  };
};

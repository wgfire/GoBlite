import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { 
  previewUrlAtom, 
  previewModeAtom, 
  previewLoadingAtom,
  
} from './atoms';
import { webContainerStatusAtom } from './atoms';
import { WebContainerStatus,ViewMode } from './types';

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

  /**
   * 刷新预览
   */
  const refresh = useCallback(() => {
    if (containerStatus === WebContainerStatus.RUNNING && url) {
      setIsLoading(true);
      // 实际应用中，这里可能需要与WebContainer API交互
      // 模拟刷新过程
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return true;
    }
    return false;
  }, [containerStatus, url, setIsLoading]);

  /**
   * 更新预览URL
   */
  const updateUrl = useCallback((newUrl: string) => {
    if (containerStatus === WebContainerStatus.RUNNING) {
      setUrl(newUrl);
      setIsLoading(true);
      // 模拟加载过程
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return true;
    }
    return false;
  }, [containerStatus, setUrl, setIsLoading]);

  /**
   * 切换预览模式
   */
  const changeViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, [setViewMode]);

  /**
   * 在新窗口打开预览
   */
  const openInNewWindow = useCallback(() => {
    if (url) {
      window.open(url, '_blank');
      return true;
    }
    return false;
  }, [url]);

  /**
   * 处理iframe加载完成
   */
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  // 获取预览尺寸
  const getPreviewSize = useCallback(() => {
    switch (viewMode) {
      case 'mobile':
        return { width: 375, height: '100%' };
      case 'tablet':
        return { width: 768, height: '100%' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
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
    getPreviewSize
  };
};

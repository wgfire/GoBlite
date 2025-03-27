import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { 
  webContainerStatusAtom, 
  previewUrlAtom, 
  errorMessageAtom,
  webContainerVisibleAtom
} from './atoms';
import { WebContainerStatus } from './types';

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

  /**
   * 初始化WebContainer
   */
  const initialize = useCallback(async () => {
    try {
      setStatus(WebContainerStatus.INITIALIZING);
      
      // 这里是WebContainer初始化的实际逻辑
      // 在实际实现中，这里会调用WebContainer API进行初始化
      
      // 模拟异步初始化过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 初始化成功
      setStatus(WebContainerStatus.RUNNING);
      setPreviewUrl('http://localhost:3000');
      return true;
    } catch (err) {
      // 初始化失败
      setStatus(WebContainerStatus.ERROR);
      setError(err instanceof Error ? err.message : '初始化失败');
      return false;
    }
  }, [setStatus, setPreviewUrl, setError]);

  /**
   * 启动WebContainer服务
   */
  const start = useCallback(async () => {
    if (status === WebContainerStatus.EMPTY || status === WebContainerStatus.STOPPED) {
      return initialize();
    } else if (status === WebContainerStatus.ERROR) {
      setError(null);
      return initialize();
    }
    return status === WebContainerStatus.RUNNING;
  }, [status, initialize, setError]);

  /**
   * 停止WebContainer服务
   */
  const stop = useCallback(() => {
    if (status === WebContainerStatus.RUNNING) {
      setStatus(WebContainerStatus.STOPPED);
      setPreviewUrl('');
    }
  }, [status, setStatus, setPreviewUrl]);

  /**
   * 重置WebContainer状态
   */
  const reset = useCallback(() => {
    setStatus(WebContainerStatus.EMPTY);
    setPreviewUrl('');
    setError(null);
  }, [setStatus, setPreviewUrl, setError]);

  /**
   * 切换WebContainer可见性
   */
  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, [setIsVisible]);

  /**
   * 设置WebContainer可见性
   */
  const setVisibility = useCallback((visible: boolean) => {
    setIsVisible(visible);
  }, [setIsVisible]);

  return {
    status,
    previewUrl,
    error,
    isVisible,
    initialize,
    start,
    stop,
    reset,
    toggleVisibility,
    setVisibility,
    isRunning: status === WebContainerStatus.RUNNING,
    isInitializing: status === WebContainerStatus.INITIALIZING,
    isError: status === WebContainerStatus.ERROR,
    isStopped: status === WebContainerStatus.STOPPED,
    isEmpty: status === WebContainerStatus.EMPTY
  };
};

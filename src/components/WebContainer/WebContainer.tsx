import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PreviewArea } from './PreviewArea';
import { TerminalArea } from './TerminalArea';
import { EmptyState } from './EmptyState';
import { useWebContainer } from '@core/webContainer';
import { WebContainerStatus } from '@core/webContainer/types';
import './WebContainer.css';

import { WebContainerProps } from './types';

export const WebContainer: React.FC<WebContainerProps> = ({ isVisible }) => {
  // 使用WebContainer hook获取状态和方法
  const {
    status,
    previewUrl,
    error,
    initialize,
    start,
    stop,
    isTerminalExpanded,
    toggleTerminal
  } = useWebContainer();

  // 处理启动服务
  const handleStart = () => {
    start();
  };

  // 处理停止服务
  const handleStop = () => {
    stop();
  };

  // 处理重试
  const handleRetry = () => {
    initialize();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="webcontainer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {status === WebContainerStatus.EMPTY && (
          <EmptyState onStart={handleStart} />
        )}

        {status === WebContainerStatus.INITIALIZING && (
          <div className="webcontainer-loading">
            <div className="loading-spinner"></div>
            <p>正在初始化 WebContainer...</p>
          </div>
        )}

        {status === WebContainerStatus.ERROR && (
          <div className="webcontainer-error">
            <h3>初始化失败</h3>
            <p>{error || '无法启动 WebContainer 服务，请检查网络连接或刷新页面重试。'}</p>
            <button onClick={handleRetry}>重试</button>
          </div>
        )}

        {(status === WebContainerStatus.RUNNING || status === WebContainerStatus.STOPPED) && (
          <div className="webcontainer-content">
            <PreviewArea 
              url={previewUrl}
              isRunning={status === WebContainerStatus.RUNNING}
              onRefresh={() => handleStart()}
              onStop={handleStop}
            />
            <TerminalArea 
              isExpanded={isTerminalExpanded}
              onToggle={toggleTerminal}
              isRunning={status === WebContainerStatus.RUNNING}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

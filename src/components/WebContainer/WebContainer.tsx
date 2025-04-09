import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PreviewArea } from "./PreviewArea";
import { TerminalArea } from "./TerminalArea";
import { EmptyState } from "./EmptyState";
import { useWebContainer } from "@core/webContainer";
import { WebContainerStatus } from "@core/webContainer/types";
import "./WebContainer.css";

import { WebContainerProps } from "./types";

export const WebContainer: React.FC<WebContainerProps> = ({ isVisible }) => {
  // 使用WebContainer hook获取状态和方法
  const { status, previewUrl, error, initialize, start, isTerminalExpanded, toggleTerminal, setIsVisible } = useWebContainer();

  // 处理可见性变化
  useEffect(() => {
    // 更新全局状态中的可见性
    setIsVisible(isVisible);

    // 如果变为可见且状态为STOPPED，尝试重启
    if (isVisible && status === WebContainerStatus.STOPPED) {
      console.log("WebContainer变为可见，检查服务状态...");
      start();
    }
  }, [isVisible, setIsVisible, status, start]);

  // 添加事件监听器，处理WebContainer刷新请求
  useEffect(() => {
    // 处理刷新事件
    const handleRefreshNeeded = () => {
      console.log("收到WebContainer刷新请求，重新获取服务URL");
      // 重新启动WebContainer服务，获取新的URL
      start();
    };

    // 添加事件监听器
    window.addEventListener("webcontainer-refresh-needed", handleRefreshNeeded);

    // 清理函数
    return () => {
      window.removeEventListener("webcontainer-refresh-needed", handleRefreshNeeded);
    };
  }, [start]);

  // 处理启动服务
  const handleStart = () => {
    start();
  };

  // 处理重试
  const handleRetry = () => {
    initialize();
  };

  // 即使WebContainer不可见，也保留DOM结构但隐藏它
  // 这样可以保持状态，避免频繁的挂载/卸载
  if (!isVisible) {
    return <div style={{ display: "none" }} className="webcontainer-hidden"></div>;
  }

  return (
    <AnimatePresence>
      <motion.div className="webcontainer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        {status === WebContainerStatus.EMPTY && <EmptyState onStart={handleStart} />}

        {status === WebContainerStatus.INITIALIZING && (
          <div className="webcontainer-loading">
            <div className="loading-spinner"></div>
            <p>正在初始化项目...</p>
          </div>
        )}

        {status === WebContainerStatus.ERROR && (
          <div className="webcontainer-error">
            <h3>初始化失败</h3>
            <p>{error || "无法启动 WebContainer 服务，请检查网络连接或刷新页面重试。"}</p>
            <button onClick={handleRetry}>重试</button>
          </div>
        )}

        {(status === WebContainerStatus.RUNNING || status === WebContainerStatus.STOPPED) && (
          <div className="webcontainer-content">
            <PreviewArea
              url={previewUrl}
              isRunning={status === WebContainerStatus.RUNNING}
              onRefresh={() => handleStart()}
              onStop={() => {
                /* 移除停止功能 */
              }}
            />
            <TerminalArea isExpanded={isTerminalExpanded} onToggle={toggleTerminal} isRunning={status === WebContainerStatus.RUNNING} />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

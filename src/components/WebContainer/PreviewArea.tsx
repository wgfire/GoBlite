import React, { useRef } from "react";
import { FiRefreshCw, FiMonitor, FiTablet, FiSmartphone, FiExternalLink } from "react-icons/fi";
import { usePreview } from "@core/webContainer";
import { PreviewAreaProps } from "./types";
import "./PreviewArea.css";

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  url = "",
  isRunning = false,
  onRefresh,
  onStop, 
}) => {
  const { viewMode, isLoading, changeViewMode, refresh, updateUrl, openInNewWindow, handleIframeLoad } = usePreview();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [urlInput, setUrlInput] = React.useState(url);
  const [iframeError, setIframeError] = React.useState(false);

  // 当URL属性变化时更新输入框
  React.useEffect(() => {
    setUrlInput(url);
    setIframeError(false);
  }, [url]);

  // 处理刷新
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      refresh();
    }
    setIframeError(false);
  };

  // 处理URL输入变化
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };

  // 处理URL输入提交
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      updateUrl(urlInput);
      setIframeError(false);
    }
  };

  // 在新窗口打开
  const handleOpenInNewWindow = () => {
    openInNewWindow();
  };

  // 处理iframe加载错误
  const handleIframeError = () => {
    setIframeError(true);
  };

  return (
    <div className="preview-area">
      <div className="preview-toolbar">
        <div className="preview-controls">
          <button className="preview-control-button" onClick={handleRefresh} title={isRunning ? "刷新预览" : "启动服务"}>
            <FiRefreshCw className={isLoading ? "spin" : ""} />
          </button>

          <button className="preview-control-button" onClick={handleOpenInNewWindow} title="在新窗口打开" disabled={!url}>
            <FiExternalLink />
          </button>
        </div>

        <div className="preview-view-modes">
          <button
            className={`preview-view-mode-button ${viewMode === "desktop" ? "active" : ""}`}
            onClick={() => changeViewMode("desktop")}
            title="桌面视图"
          >
            <FiMonitor />
          </button>
          <button
            className={`preview-view-mode-button ${viewMode === "tablet" ? "active" : ""}`}
            onClick={() => changeViewMode("tablet")}
            title="平板视图"
          >
            <FiTablet />
          </button>
          <button
            className={`preview-view-mode-button ${viewMode === "mobile" ? "active" : ""}`}
            onClick={() => changeViewMode("mobile")}
            title="移动视图"
          >
            <FiSmartphone />
          </button>
        </div>

        <form className="preview-url-bar" onSubmit={handleUrlSubmit}>
          <input
            type="text"
            className="preview-url-input"
            value={urlInput}
            onChange={handleUrlChange}
            placeholder="WebContainer内部服务URL"
            disabled={!isRunning}
          />
        </form>
      </div>

      <div className={`preview-content ${viewMode}`}>
        {isLoading && (
          <div className="preview-loading">
            <div className="loading-spinner"></div>
            <p>加载中...</p>
          </div>
        )}

        {!url ? (
          <div className="preview-placeholder">
            <p>等待WebContainer内部服务启动</p>
            <p className="preview-placeholder-hint">
              {isRunning ? (
                <>
                  正在启动模板代码的开发服务器，请稍候...
                  <br />
                  <small>这个过程可能需要几秒钟，取决于模板的复杂度</small>
                </>
              ) : (
                "请点击上方按钮启动WebContainer服务"
              )}
            </p>
          </div>
        ) : iframeError ? (
          <div className="preview-error">
            <p>无法加载WebContainer内部服务</p>
            <p className="preview-error-hint">
              可能的原因：
              <ul>
                <li>WebContainer内部服务尚未完全启动</li>
                <li>模板代码存在错误导致服务启动失败</li>
                <li>浏览器安全策略限制了iframe的访问</li>
              </ul>
              <button className="preview-retry-button" onClick={handleRefresh}>
                重试
              </button>
            </p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="preview-iframe"
            src={url}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            title="WebContainer Preview"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        )}
      </div>
    </div>
  );
};

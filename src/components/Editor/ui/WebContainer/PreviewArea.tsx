import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiMonitor, FiTablet, FiSmartphone, FiExternalLink, FiStopCircle } from 'react-icons/fi';
import { usePreview } from '../../webContainer';
import { PreviewAreaProps } from './types';
import './PreviewArea.css';

export const PreviewArea: React.FC<PreviewAreaProps> = ({ 
  url = '', 
  isRunning = false,
  onRefresh,
  onStop
}) => {
  const {
    viewMode,
    isLoading,
    changeViewMode,
    refresh,
    updateUrl,
    openInNewWindow,
    handleIframeLoad
  } = usePreview();
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [urlInput, setUrlInput] = React.useState(url);

  // 当URL属性变化时更新输入框
  React.useEffect(() => {
    setUrlInput(url);
  }, [url]);

  // 处理刷新
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      refresh();
    }
  };

  // 处理停止
  const handleStop = () => {
    if (onStop) {
      onStop();
    }
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
    }
  };

  // 在新窗口打开
  const handleOpenInNewWindow = () => {
    openInNewWindow();
  };

  return (
    <div className="preview-area">
      <div className="preview-toolbar">
        <div className="preview-controls">
          {isRunning ? (
            <button 
              className="preview-control-button" 
              onClick={handleStop}
              title="停止服务"
            >
              <FiStopCircle />
            </button>
          ) : (
            <button 
              className="preview-control-button" 
              onClick={handleRefresh}
              title="启动服务"
            >
              <FiRefreshCw className={isLoading ? 'spin' : ''} />
            </button>
          )}
          
          <button 
            className="preview-control-button" 
            onClick={handleOpenInNewWindow}
            title="在新窗口打开"
            disabled={!url}
          >
            <FiExternalLink />
          </button>
        </div>
        
        <div className="preview-view-modes">
          <button 
            className={`preview-view-mode-button ${viewMode === 'desktop' ? 'active' : ''}`}
            onClick={() => changeViewMode('desktop')}
            title="桌面视图"
          >
            <FiMonitor />
          </button>
          <button 
            className={`preview-view-mode-button ${viewMode === 'tablet' ? 'active' : ''}`}
            onClick={() => changeViewMode('tablet')}
            title="平板视图"
          >
            <FiTablet />
          </button>
          <button 
            className={`preview-view-mode-button ${viewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => changeViewMode('mobile')}
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
            placeholder="输入URL地址"
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
            <p>没有可预览的内容</p>
            <p className="preview-placeholder-hint">
              {isRunning ? '请输入URL地址' : '请先启动服务'}
            </p>
          </div>
        ) : (
          <iframe 
            ref={iframeRef}
            className="preview-iframe"
            src={url}
            onLoad={handleIframeLoad}
            title="WebContainer Preview"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        )}
      </div>
    </div>
  );
};

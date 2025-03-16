import React, { useEffect, useRef } from 'react';
import { useWebContainer } from '../hooks/useWebContainer';

interface WebContainerPreviewProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * WebContainer预览组件
 * 用于展示WebContainer中运行的应用
 */
const WebContainerPreview: React.FC<WebContainerPreviewProps> = ({ className, style }) => {
  const { serverUrl, buildInfo } = useWebContainer();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 当服务器URL变化时更新iframe
  useEffect(() => {
    if (serverUrl && iframeRef.current) {
      iframeRef.current.src = serverUrl;
    }
  }, [serverUrl]);

  return (
    <div className={`web-container-preview ${className || ''}`} style={{ width: '100%', height: '100%', ...style }}>
      {serverUrl ? (
        <iframe 
          ref={iframeRef}
          src={serverUrl}
          title="WebContainer Preview"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="cross-origin-isolated"
        />
      ) : (
        <div className="preview-placeholder" style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3>应用预览</h3>
          <p>{buildInfo.status === 'running' ? '加载中...' : '启动开发服务器后此处将显示应用预览'}</p>
          <p>{buildInfo.error && <span style={{ color: 'red' }}>{buildInfo.error}</span>}</p>
        </div>
      )}
    </div>
  );
};

export default WebContainerPreview;

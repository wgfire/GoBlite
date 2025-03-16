import React from 'react';
import { EditorProvider } from '../hooks/useEditor';
import CodeEditor from './CodeEditor';
import FileExplorer from './FileExplorer';
import { EditorOptions } from '../types';

interface EditorProps {
  initialOptions?: Partial<EditorOptions>;
  className?: string;
  style?: React.CSSProperties;
  showFileExplorer?: boolean;
  fileExplorerWidth?: number | string;
}

/**
 * 编辑器主组件
 * 集成文件浏览器和代码编辑器
 */
const Editor: React.FC<EditorProps> = ({ 
  initialOptions, 
  className, 
  style,
  showFileExplorer = true,
  fileExplorerWidth = '250px'
}) => {
  return (
    <EditorProvider initialOptions={initialOptions}>
      <div 
        className={`editor-container ${className || ''}`} 
        style={{ 
          display: 'flex', 
          width: '100%', 
          height: '100%', 
          overflow: 'hidden',
          ...style 
        }}
      >
        {showFileExplorer && (
          <div 
            className="file-explorer-container" 
            style={{ 
              width: fileExplorerWidth, 
              borderRight: '1px solid #3c3c3c' 
            }}
          >
            <FileExplorer />
          </div>
        )}
        
        <div 
          className="code-editor-container" 
          style={{ 
            flex: 1,
            overflow: 'hidden'
          }}
        >
          <CodeEditor />
        </div>
      </div>
    </EditorProvider>
  );
};

export default Editor;

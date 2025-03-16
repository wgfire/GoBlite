import React, { useEffect, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { useEditor } from '../hooks/useEditor';
import { EditorEventType } from '../types';
import { eventBus } from '@vite-goblite/core';

interface CodeEditorProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 代码编辑器组件
 * 基于Monaco Editor实现的代码编辑器
 */
const CodeEditor: React.FC<CodeEditorProps> = ({ className, style }) => {
  const { 
    activeFile, 
    options, 
    saveFile, 
    setEditorInstance,
    isReady
  } = useEditor();
  
  const editorRef = useRef<any>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 处理编辑器内容变更
  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || !value) return;
    
    // 触发内容变更事件
    eventBus.emit(EditorEventType.CONTENT_CHANGE, { 
      path: activeFile.path, 
      content: value 
    });
    
    // 如果启用了自动保存，设置定时器
    if (options.autoSave) {
      // 清除之前的定时器
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // 设置新的定时器
      autoSaveTimerRef.current = setTimeout(() => {
        saveFile(activeFile.path, value);
      }, options.autoSaveDelay || 1000);
    }
  };

  // 处理编辑器挂载
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    setEditorInstance(editor);
    
    // 添加快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (activeFile) {
        const value = editor.getValue();
        saveFile(activeFile.path, value);
      }
    });
  };

  // 清理自动保存定时器
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`code-editor ${className || ''}`} style={{ width: '100%', height: '100%', ...style }}>
      {activeFile ? (
        <Editor
          height="100%"
          language={activeFile.language || 'javascript'}
          value={activeFile.content}
          theme={options.theme}
          options={{
            ...options,
            readOnly: activeFile.readOnly
          }}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      ) : (
        <div className="editor-placeholder" style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3>代码编辑器</h3>
          <p>请选择一个文件进行编辑</p>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;

import { useEffect, useState, useCallback, useRef } from "react";
import { useEditor } from "@core/editor/hooks/useEditor";
import { useFileSystem } from "@core/fileSystem/hooks/useFileSystem";
import "./style/editor.css";
import './style/syntax.css';

interface EditorProps {
  initialCode?: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
}

export const Editor = ({
  initialCode,
  onChange,
  readonly = false
}: EditorProps) => {
  const { activeFile, updateFileContent, activeFileContent } = useFileSystem();
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const isUpdatingRef = useRef(false);
  
  // 先定义handleEditorChange函数
  const handleEditorChange = useCallback((newContent: string) => {
    if (isUpdatingRef.current) return; // 防止循环更新
    
    // 只调用外部的onChange，不直接更新文件系统
    if (onChange) {
      onChange(newContent);
    }
  }, [onChange]);
  
  // 然后再使用这个函数
  const { editorContainerRef, updateContent } = useEditor({
    initialDoc: initialCode || "",
    onChange: handleEditorChange,
    readonly
  });

  // 当active file变化时，更新编辑器内容
  useEffect(() => {
    if (activeFile && activeFile !== currentFile) {
      // 设置标志，防止触发onChange回调
      isUpdatingRef.current = true;
      
      // 只有当activeFile变化时才更新编辑器内容
      const content = activeFileContent ? activeFileContent : (initialCode || "");
      updateContent(content);
      setCurrentFile(activeFile);
      
      // 重置标志
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [activeFile, currentFile, updateContent, activeFileContent, initialCode]);

  return (
    <div className="editor-container">
      <div className="editor-wrapper" ref={editorContainerRef}></div>
    </div>
  );
};
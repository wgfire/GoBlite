import { useEffect, useState, useCallback } from "react";
import { useEditor } from "./core/useEditor";
import { useFileSystem } from "./fileSystem/useFileSystem";
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
  const { activeFile, updateFileContent, getActiveFileContent } = useFileSystem();
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  
  // 先定义handleEditorChange函数
  const handleEditorChange = useCallback((newContent: string) => {
    if (activeFile) {
      updateFileContent(activeFile, newContent);
    }
    if (onChange) {
      onChange(newContent);
    }
  }, [activeFile, onChange, updateFileContent]);
  
  // 然后再使用这个函数
  const { editorContainerRef, updateContent, getContent } = useEditor({
    initialDoc: initialCode || "",
    onChange: handleEditorChange,
    readonly
  });

  // When active file changes, update editor content
  useEffect(() => {
    if (activeFile && activeFile !== currentFile) {
      // 只有当 activeFile 变化时才更新编辑器内容
      const content = getActiveFileContent ? getActiveFileContent() : (initialCode || "");
      updateContent(content);
      setCurrentFile(activeFile);
    }
  }, [activeFile, currentFile, updateContent, getActiveFileContent]);

  return (
    <div className="editor-container">
      <div className="editor-wrapper" ref={editorContainerRef}></div>
    </div>
  );
};
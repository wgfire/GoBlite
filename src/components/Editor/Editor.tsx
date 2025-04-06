import { useEffect, useCallback } from "react";
import { useEditor } from "@core/editor/hooks/useEditor";
import "./style/editor.css";
import "./style/syntax.css";

interface EditorProps {
  initialCode?: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
}

export const Editor = ({ initialCode, onChange, readonly = false }: EditorProps) => {
  // 先定义handleEditorChange函数
  const handleEditorChange = useCallback(
    (newContent: string) => {
      // 只调用外部的onChange，不直接更新文件系统
      if (onChange) {
        onChange(newContent);
      }
    },
    [onChange]
  );

  // 然后再使用这个函数
  const { editorContainerRef, updateContent, getContent } = useEditor({
    // Destructure updateContent and getContent
    initialDoc: initialCode || "",
    onChange: handleEditorChange,
    readonly,
  });

  // 切换文件时 更新文件内容
  useEffect(() => {
    if (initialCode !== undefined && getContent && updateContent) {
      const currentContent = getContent();
      console.log("Editor: initialCode:", initialCode == currentContent); // true
      if (initialCode !== currentContent) {
        console.log("Editor: initialCode differs from current content, updating editor.");
        updateContent(initialCode);
      } else {
        console.log("Editor: initialCode matches current content, skipping update.");
      }
    }
  }, [initialCode, updateContent, getContent]); // Add dependencies

  return (
    <div className="editor-container">
      <div className="editor-wrapper" ref={editorContainerRef}></div>
    </div>
  );
};

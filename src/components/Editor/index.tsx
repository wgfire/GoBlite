import { useEffect, useState, useCallback, useRef } from "react";
import { useEditor } from "@core/editor/hooks/useEditor";
import { useFileSystem } from "@core/fileSystem/hooks/useFileSystem";
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
  const { editorContainerRef } = useEditor({
    initialDoc: initialCode || "",
    onChange: handleEditorChange,
    readonly,
  });

  return (
    <div className="editor-container">
      <div className="editor-wrapper" ref={editorContainerRef}></div>
    </div>
  );
};

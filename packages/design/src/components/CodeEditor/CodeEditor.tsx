import React, { useEffect, useMemo } from "react";
import { autocompletion } from "@codemirror/autocomplete";
import { Extension } from "@codemirror/state";
import { useCodeMirror } from "./useCodeMirror";
import { CodeEditorProps } from "./types";
import { createGlobalCompletions } from "./utils/createGlobalCompletions";
import { customApis as defaultCustomApis } from "./customApiTip";

// 导入编辑器样式
import "./CodeEditor.css";

/**
 * 代码编辑器组件
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue = "",
  language = "javascript",
  theme = "light",
  readOnly = false,
  height = "300px",
  onChange,
  extensions = [],
  globals = {},
  className = "",
  autoFocus = false
}) => {
  // 创建自动完成扩展
  const autoCompleteExtension = useMemo(() => {
    return autocompletion({
      override: [createGlobalCompletions(globals, defaultCustomApis)]
    });
  }, [globals]);

  // 合并扩展
  const mergedExtensions: Extension[] = useMemo(() => {
    return [autoCompleteExtension, ...extensions];
  }, [autoCompleteExtension, extensions]);

  // 使用 CodeMirror 钩子
  const { editorRef } = useCodeMirror({
    initialValue,
    language,
    theme,
    readOnly,
    onChange,
    extensions: mergedExtensions,
    height
  });

  // 自动聚焦
  useEffect(() => {
    if (autoFocus && editorRef.current) {
      const editorElement = editorRef.current.querySelector(".cm-content");
      if (editorElement) {
        (editorElement as HTMLElement).focus();
      }
    }
  }, [autoFocus, editorRef]);

  return (
    <div className={`code-editor-container ${className}`} style={{ width: "100%" }}>
      <div
        ref={editorRef}
        className="code-editor"
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          width: "100%",
          overflow: "hidden",
          borderRadius: "4px",
          border: "1px solid #e5e7eb"
        }}
      />
    </div>
  );
};

export default CodeEditor;

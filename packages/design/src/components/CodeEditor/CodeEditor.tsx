import React, { useEffect, useMemo } from "react";
import { autocompletion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { Extension } from "@codemirror/state";
import { useCodeMirror } from "./useCodeMirror";
import { CodeEditorProps } from "./types";

/**
 * 创建全局对象自动完成提供器
 */
const createGlobalCompletions = (globals: Record<string, any> = {}) => {
  return (context: CompletionContext): CompletionResult | null => {
    // 获取当前光标前的文本
    const { state, pos } = context;
    const line = state.doc.lineAt(pos);
    const lineStart = line.from;
    const textBefore = line.text.slice(0, pos - lineStart);

    // 检查是否正在输入全局对象属性
    const dotMatch = /(?:window|document|global)\.(\w*)$/.exec(textBefore);
    if (!dotMatch) return null;

    const prefix = dotMatch[0].split(".")[0]; // window, document, global 等
    const objToComplete =
      prefix === "window" ? globals : prefix === "document" ? document : prefix === "global" ? globals : null;

    if (!objToComplete) return null;

    // 生成补全项
    const options = Object.keys(objToComplete).map(key => ({
      label: key,
      type: typeof objToComplete[key as keyof typeof objToComplete] === "function" ? "function" : "variable",
      detail: typeof objToComplete[key as keyof typeof objToComplete],
      apply: key
    }));

    return {
      from: pos - (dotMatch[1]?.length || 0),
      options
      // span 属性在最新版本不再支持
    };
  };
};

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
      override: [createGlobalCompletions(globals)]
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
    <div className={`code-editor-container ${className}`}>
      <div
        ref={editorRef}
        className="code-editor"
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          overflow: "hidden",
          borderRadius: "4px",
          border: "1px solid #e5e7eb"
        }}
      />
    </div>
  );
};

export default CodeEditor;

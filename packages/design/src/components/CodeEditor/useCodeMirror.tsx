import { useEffect, useRef, useState } from "react";
import { EditorState, Extension } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";
import { history, historyKeymap } from "@codemirror/commands";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

import { LanguageType, ThemeType } from "./types";

// 基础扩展
const baseExtensions = [
  lineNumbers(),
  highlightActiveLine(),
  history(),
  bracketMatching(),
  closeBrackets(),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle),
  keymap.of([...closeBracketsKeymap, ...historyKeymap])
];

/**
 * 获取语言扩展
 */
const getLanguageExtension = (language: LanguageType): Extension => {
  switch (language) {
    case "javascript":
      return javascript();
    case "css":
      return css();
    case "html":
      return html();
    case "json":
      return json();
    default:
      return javascript();
  }
};

/**
 * 获取主题扩展
 */
const getThemeExtension = (theme: ThemeType): Extension => {
  switch (theme) {
    case "dark":
      return oneDark;
    case "light":
    default:
      return [];
  }
};

interface UseCodeMirrorOptions {
  initialValue?: string;
  language?: LanguageType;
  theme?: ThemeType;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  extensions?: Extension[];
  height?: string | number;
}

/**
 * CodeMirror钩子
 */
export const useCodeMirror = ({
  initialValue = "",
  language = "javascript",
  theme = "light",
  readOnly = false,
  onChange,
  extensions = [],
  height = "300px"
}: UseCodeMirrorOptions = {}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [value, setValue] = useState(initialValue);

  // 创建编辑器
  useEffect(() => {
    if (!editorRef.current) return;

    // 清理现有视图
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    // 计算高度
    const heightStyle = typeof height === "number" ? `${height}px` : height;

    // 创建新视图
    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        ...baseExtensions,
        getLanguageExtension(language),
        getThemeExtension(theme),
        ...(readOnly ? [EditorView.editable.of(false)] : []),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            setValue(newValue);
            onChange?.(newValue);
          }
        }),
        EditorView.theme({
          "&": {
            height: heightStyle
          },
          ".cm-scroller": {
            fontFamily: "monospace",
            overflow: "auto"
          }
        }),
        ...extensions
      ]
    });

    const view = new EditorView({
      state,
      parent: editorRef.current
    });

    viewRef.current = view;

    // 清理函数
    return () => {
      view.destroy();
    };
  }, [initialValue, language, theme, readOnly, height, extensions]);

  return {
    editorRef,
    value,
    setValue
  };
};

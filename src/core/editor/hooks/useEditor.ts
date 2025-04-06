import { useEffect, useMemo, useRef } from "react";
import { EditorState, Extension, StateEffect } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection, rectangularSelection, crosshairCursor } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, undo as undoCommand, redo as redoCommand, indentWithTab } from "@codemirror/commands";
import useMemoizedFn from "@/hooks/useMemoizedFn"; // Import the custom hook
import { indentOnInput, bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { searchKeymap, search } from "@codemirror/search";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { EditorTheme, themeExtensionAtom } from "@components/Editor/theme/themeManager";
import { useAtomValue } from "jotai";

/**创建编辑器 */
export interface EditorOptions {
  initialDoc?: string;
  extensions?: Extension[];
  onChange?: (value: string) => void;
  readonly?: boolean;
  language?: "javascript" | "typescript" | "html" | "css" | "json";
  theme?: EditorTheme;
}

// 默认的Hello World JavaScript代码
const DEFAULT_JAVASCRIPT_CODE = `// JavaScript Hello World
console.log("Hello, World!");

// 一个简单的函数
function greet(name) {
  return \`Hello, \${name}!\`;
}

// 调用该函数
const message = greet("CodeMirror");
console.log(message);
`;

export const useEditor = (options: EditorOptions = {}) => {
  const { initialDoc = DEFAULT_JAVASCRIPT_CODE, extensions = [], onChange, readonly = false, language = "javascript" } = options;

  // 获取主题扩展
  const themeExtension = useAtomValue(themeExtensionAtom);

  const editorViewRef = useRef<EditorView | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<string>(initialDoc);
  const onChangeRef = useRef(onChange);

  /**自动完成 */
  const autoParams = useMemo(
    () =>
      autocompletion({
        activateOnTyping: true,
        maxRenderedOptions: 10,
        defaultKeymap: true,
        icons: true,
      }),
    []
  );

  // 根据语言选择相应的语言支持
  const getLanguageExtension = useMemo(() => {
    switch (language) {
      case "javascript":
      case "typescript":
      case "json":
        return javascript();
      case "html":
        return html();
      case "css":
        return css();
      default:
        return javascript({ jsx: true });
    }
  }, [language]);

  // 基础扩展
  const baseExtensions: Extension[] = useMemo(() => {
    return [
      lineNumbers(),
      highlightActiveLine(),
      history(),
      bracketMatching(),
      indentOnInput(),
      drawSelection(),
      rectangularSelection(),
      crosshairCursor(),
      search({
        top: true,
      }),
      foldGutter(),
      keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap, ...foldKeymap, ...completionKeymap, indentWithTab]),
      getLanguageExtension,
      autoParams,
      themeExtension, // Use the theme extension
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newContent = update.state.doc.toString();
          contentRef.current = newContent;
          if (onChangeRef.current) {
            onChangeRef.current(newContent);
          }
        }
      }),
    ];
  }, [getLanguageExtension, themeExtension, autoParams]);

  // 更新 onChange 引用以避免闭包问题
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 设置编辑器内容
  const setContent = (content: string, force: boolean = false) => {
    const view = editorViewRef.current;
    if (!view) return;

    // 仅在强制更新或内容与编辑器当前实际内容不同时才更新
    const currentDoc = view.state.doc.toString();
    if (!force && content === currentDoc) {
      console.log("setContent: Content is the same, skipping update.");
      return;
    }

    console.log(`setContent: Updating content (force=${force}).`);
    // contentRef should only be updated by the updateListener to reflect the true editor state.
    // Do not update contentRef here.

    const transaction = view.state.update({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: content,
      },
      // Optionally, preserve selection if needed, though full replace usually resets it.
      // selection: view.state.selection,
      // userEvent: 'setContent' // Add a user event annotation if needed for other extensions
    });

    view.dispatch(transaction);
  };

  // 更新编辑器内容 - 用于文件切换，总是强制更新
  const updateContent = useMemoizedFn((content: string) => {
    setContent(content, true);
  });

  // 获取编辑器内容
  const getContent = useMemoizedFn((): string => {
    if (!editorViewRef.current) return contentRef.current;
    return editorViewRef.current.state.doc.toString();
  });

  // 聚焦编辑器
  const focus = useMemoizedFn(() => {
    editorViewRef.current?.focus();
  });

  // 刷新编辑器
  const refresh = useMemoizedFn(() => {
    if (editorViewRef.current) {
      editorViewRef.current.requestMeasure();
    }
  });

  // 在光标位置插入内容
  const insertAtCursor = useMemoizedFn((content: string) => {
    if (!editorViewRef.current) return;

    const selection = editorViewRef.current.state.selection.main;
    const transaction = editorViewRef.current.state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: content,
      },
      selection: { anchor: selection.from + content.length },
    });

    editorViewRef.current.dispatch(transaction);
  });

  // 撤销操作
  const undo = useMemoizedFn(() => {
    if (!editorViewRef.current) return;
    undoCommand(editorViewRef.current);
  });

  // 重做操作
  const redo = useMemoizedFn(() => {
    if (!editorViewRef.current) return;
    redoCommand(editorViewRef.current);
  });

  // 格式化代码
  const formatCode = useMemoizedFn(() => {
    // 实现代码格式化逻辑，可以使用prettier或其他格式化库
    console.log("Format code functionality to be implemented");
  });

  // 切换注释
  const toggleComment = useMemoizedFn(() => {
    if (!editorViewRef.current) return;
    // 使用CodeMirror的注释功能
    console.log("Toggle comment functionality to be implemented");
  });

  // 查找和替换
  const findAndReplace = useMemoizedFn((find: string, replace: string) => {
    // Removed unused _replaceAll parameter
    if (!editorViewRef.current) return;
    // 实现查找和替换逻辑
    // TODO: Implement find and replace, potentially using the 'replaceAll' flag later
    console.log("Find and replace functionality to be implemented", find, replace);
  });

  // 初始化编辑器 - 只在组件挂载时初始化一次
  useEffect(() => {
    // 如果容器尚未准备好，不执行任何操作
    if (!editorContainerRef.current) return;

    // 如果编辑器已经存在，不重新初始化
    if (editorViewRef.current && editorContainerRef.current.childElementCount > 0) {
      return;
    }

    // 创建编辑器状态
    const state = EditorState.create({
      doc: contentRef.current, // Use initialDoc for initial state, not contentRef
      extensions: [...baseExtensions, ...extensions, ...(readonly ? [EditorState.readOnly.of(true)] : [])],
    });

    // 创建编辑器视图
    const view = new EditorView({
      state,
      parent: editorContainerRef.current,
    });

    editorViewRef.current = view;

    console.log("Editor initialized.");

    // 组件卸载时销毁编辑器
    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 有意忽略依赖项，只在组件挂载时初始化一次

  // 当扩展或只读状态变化时，使用 reconfigure 更新编辑器
  useEffect(() => {
    // 如果编辑器尚未初始化，不执行任何操作
    if (!editorViewRef.current) return;

    // 使用 StateEffect.reconfigure 更新扩展，而不是重新创建编辑器实例
    const combinedExtensions = [...baseExtensions, ...extensions, ...(readonly ? [EditorState.readOnly.of(true)] : [])];
    editorViewRef.current.dispatch({
      effects: StateEffect.reconfigure.of(combinedExtensions),
    });

    console.log("Editor extensions reconfigured.");
  }, [baseExtensions, extensions, readonly]);

  return {
    editorContainerRef,
    editorViewRef,
    setContent,
    updateContent,
    getContent,
    focus,
    refresh,
    undo,
    redo,
    insertAtCursor,
    formatCode,
    toggleComment,
    findAndReplace,
  };
};

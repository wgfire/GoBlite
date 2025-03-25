import { useEffect, useMemo, useRef } from 'react';
import { EditorState, Extension } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection, rectangularSelection, crosshairCursor } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, undo as undoCommand, redo as redoCommand, indentWithTab } from '@codemirror/commands';
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { searchKeymap, search } from '@codemirror/search';
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";


export interface EditorOptions {
  initialDoc?: string;
  extensions?: Extension[];
  onChange?: (value: string) => void;
  readonly?: boolean;
  language?: 'javascript' | 'typescript' | 'html' | 'css' | 'json';
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
  const {
    initialDoc = DEFAULT_JAVASCRIPT_CODE,
    extensions = [],
    onChange,
    readonly = false,
    language = 'javascript'
  } = options;

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
      case 'javascript':
      case 'typescript':
      case 'json':
        return javascript();
      case 'html':
        return html();
      case 'css':
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
      syntaxHighlighting(defaultHighlightStyle),
      drawSelection(),
      rectangularSelection(),
      crosshairCursor(),
      search({
        top: true
      }),
      foldGutter(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        ...foldKeymap,
        ...completionKeymap,
        indentWithTab,
      ]),
      getLanguageExtension,
      autoParams,
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const newContent = update.state.doc.toString();
          contentRef.current = newContent;
          if (onChangeRef.current) {
            onChangeRef.current(newContent);
          }
        }
      }),
    ];
  }, []); 

  // 更新 onChange 引用以避免闭包问题
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 设置编辑器内容，但仅在内容实际变化且不是由编辑器内部更改触发时
  const setContent = (content: string) => {
    if (!editorViewRef.current || content === contentRef.current) return;

    contentRef.current = content;

    const transaction = editorViewRef.current.state.update({
      changes: {
        from: 0,
        to: editorViewRef.current.state.doc.length,
        insert: content
      }
    });

    editorViewRef.current.dispatch(transaction);
  };

  // 更新编辑器内容 - 用于文件切换
  const updateContent = (content: string) => {
    if (!editorViewRef.current) return;
    
    // 强制更新内容，无论当前内容是什么
    contentRef.current = content;
    
    const transaction = editorViewRef.current.state.update({
      changes: {
        from: 0,
        to: editorViewRef.current.state.doc.length,
        insert: content
      }
    });

    editorViewRef.current.dispatch(transaction);
  };

  // 获取编辑器内容
  const getContent = (): string => {
    if (!editorViewRef.current) return contentRef.current;
    return editorViewRef.current.state.doc.toString();
  };

  // 聚焦编辑器
  const focus = () => {
    editorViewRef.current?.focus();
  };

  // 刷新编辑器
  const refresh = () => {
    if (editorViewRef.current) {
      editorViewRef.current.requestMeasure();
    }
  };

  // 在光标位置插入内容
  const insertAtCursor = (content: string) => {
    if (!editorViewRef.current) return;

    const selection = editorViewRef.current.state.selection.main;
    const transaction = editorViewRef.current.state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: content
      },
      selection: { anchor: selection.from + content.length }
    });

    editorViewRef.current.dispatch(transaction);
  };

  // 撤销操作
  const undo = () => {
    if (!editorViewRef.current) return;
    undoCommand(editorViewRef.current);
  };

  // 重做操作
  const redo = () => {
    if (!editorViewRef.current) return;
    redoCommand(editorViewRef.current);
  };

  // 格式化代码
  const formatCode = () => {
    // 实现代码格式化逻辑，可以使用prettier或其他格式化库
    console.log('Format code functionality to be implemented');
  };

  // 切换注释
  const toggleComment = () => {
    if (!editorViewRef.current) return;
    // 使用CodeMirror的注释功能
    console.log('Toggle comment functionality to be implemented');
  };

  // 查找和替换
  const findAndReplace = (find: string, replace: string, replaceAll: boolean = false) => {
    if (!editorViewRef.current) return;
    // 实现查找和替换逻辑
    console.log('Find and replace functionality to be implemented');
  };

  // 初始化编辑器
  useEffect(() => {
    // 如果容器尚未准备好，不执行任何操作
    if (!editorContainerRef.current) return;

    // 如果编辑器已经存在，不重新初始化
    if (editorViewRef.current && editorContainerRef.current.childElementCount > 0) {
      return;
    }

    // 创建编辑器状态
    const state = EditorState.create({
      doc: contentRef.current,
      extensions: [
        ...baseExtensions,
        ...extensions,
        ...(readonly ? [EditorState.readOnly.of(true)] : [])
      ]
    });

    // 创建编辑器视图
    const view = new EditorView({
      state,
      parent: editorContainerRef.current
    });

    editorViewRef.current = view;

    // 组件卸载时销毁编辑器
    return () => {
      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, [readonly, extensions]); // 移除 baseExtensions 依赖

  // 当initialDoc从外部更改并且与当前内容不同时更新编辑器内容
  useEffect(() => {
    // 只在编辑器没有焦点或初始化时更新内容
    if (initialDoc !== undefined && initialDoc !== contentRef.current && editorViewRef.current) {
      // 检查编辑器是否有焦点
      const editorHasFocus = document.activeElement === editorViewRef.current.dom;
      if (!editorHasFocus) {
        setContent(initialDoc);
      }
    }
  }, [initialDoc]);

  useEffect(() => {
    // 当extensions发生变化时，应用新的扩展，但不重新创建编辑器
    if (editorViewRef.current && extensions.length > 0) {
      const newState = EditorState.create({
        doc: editorViewRef.current.state.doc,
        extensions: [
          ...baseExtensions,
          ...(readonly ? [EditorState.readOnly.of(true)] : []),
          ...extensions
        ]
      });

      editorViewRef.current.setState(newState);
    }
  }, [extensions, readonly, baseExtensions]);

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
    findAndReplace
  };
};

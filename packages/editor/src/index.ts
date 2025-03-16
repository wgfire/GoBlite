// 导出组件
export { default as Editor } from './components/Editor';
export { default as CodeEditor } from './components/CodeEditor';
export { default as FileExplorer } from './components/FileExplorer';

// 导出hooks
export { EditorProvider, useEditor } from './hooks/useEditor';

// 导出类型
export * from './types';

// 版本信息
export const VERSION = '0.1.0';

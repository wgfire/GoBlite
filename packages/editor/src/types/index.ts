import { editor as monacoEditor } from 'monaco-editor';

/**
 * 编辑器主题类型
 */
export type EditorTheme = 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';

/**
 * 编辑器文件类型
 */
export interface EditorFile {
  /** 文件路径 */
  path: string;
  /** 文件内容 */
  content: string;
  /** 文件语言 */
  language?: string;
  /** 是否只读 */
  readOnly?: boolean;
}

/**
 * 编辑器文件树节点类型
 */
export interface FileTreeNode {
  /** 节点ID（通常是路径） */
  id: string;
  /** 节点名称 */
  name: string;
  /** 是否是目录 */
  isDirectory: boolean;
  /** 子节点（如果是目录） */
  children?: FileTreeNode[];
  /** 文件路径 */
  path: string;
  /** 文件扩展名（如果是文件） */
  extension?: string;
}

/**
 * 编辑器配置选项
 */
export interface EditorOptions extends monacoEditor.IStandaloneEditorConstructionOptions {
  /** 编辑器主题 */
  theme?: EditorTheme;
  /** 是否显示行号 */
  lineNumbers?: 'on' | 'off' | 'relative';
  /** 是否启用代码折叠 */
  folding?: boolean;
  /** 是否自动保存 */
  autoSave?: boolean;
  /** 自动保存延迟（毫秒） */
  autoSaveDelay?: number;
  /** 是否显示缩进指南 */
  renderIndentGuides?: boolean;
  /** 是否启用代码提示 */
  suggestOnTriggerCharacters?: boolean;
  /** 是否启用代码格式化 */
  formatOnPaste?: boolean;
  /** 是否启用代码格式化（保存时） */
  formatOnSave?: boolean;
  /** 是否启用代码格式化（输入时） */
  formatOnType?: boolean;
}

/**
 * 编辑器事件类型
 */
export enum EditorEventType {
  /** 文件内容变更 */
  CONTENT_CHANGE = 'content-change',
  /** 文件保存 */
  SAVE = 'save',
  /** 文件选择变更 */
  ACTIVE_FILE_CHANGE = 'active-file-change',
  /** 文件创建 */
  FILE_CREATE = 'file-create',
  /** 文件删除 */
  FILE_DELETE = 'file-delete',
  /** 文件重命名 */
  FILE_RENAME = 'file-rename',
  /** 编辑器初始化完成 */
  EDITOR_READY = 'editor-ready'
}

/**
 * 模板元数据接口定义
 */
export interface TemplateMetadata {
  /** 模板名称 */
  name: string;
  /** 模板描述 */
  description: string;
  /** 缩略图路径 */
  thumbnail: string;
  /** 模板标签 */
  tags: string[];
  /** 使用的框架 */
  framework: 'vue' | 'react' | 'angular' | 'svelte' | string;
  /** 使用的编程语言 */
  language: 'typescript' | 'javascript';
  /** 核心依赖 */
  dependencies: Record<string, string>;
  /** 开发依赖 */
  devDependencies: Record<string, string>;
  /** 脚本命令 */
  scripts: Record<string, string>;
  /** 包含的文件列表 */
  files: string[];
  /** 模板分类 */
  category?: TemplateCategory;
  /** 模板难度级别 */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  /** 模板版本 */
  version?: string;
  /** 模板作者 */
  author?: string;
  /** 模板创建日期 */
  createdAt?: string;
  /** 模板最后更新日期 */
  updatedAt?: string;
}

/**
 * 模板分类枚举
 */
export enum TemplateCategory {
  WEB_APP = 'web-app',
  MOBILE_APP = 'mobile-app',
  DESKTOP_APP = 'desktop-app',
  LIBRARY = 'library',
  COMPONENT = 'component',
  OTHER = 'other',
}

/**
 * 文件类型接口，适用于WebContainer文件系统
 */
export interface FileInfo {
  /** 文件类型 */
  type: 'file' | 'directory';
  /** 文件内容 (仅文件类型有效) */
  contents?: string;
  /** 子文件 (仅目录类型有效) */
  children?: Record<string, FileInfo>;
  /** 文件最后修改时间 */
  lastModified?: number;
  /** 文件大小（字节） */
  size?: number;
}

/**
 * WebContainer文件系统结构
 */
export type FileSystemTree = Record<string, FileInfo>;

/**
 * 事件类型枚举
 */
export enum EventType {
  FILE_CHANGED = 'file-changed',
  BUILD_STARTED = 'build-started',
  BUILD_COMPLETED = 'build-completed',
  BUILD_FAILED = 'build-failed',
  SERVER_STARTED = 'server-started',
  DEPENDENCIES_INSTALLED = 'dependencies-installed',
  TEMPLATE_LOADED = 'template-loaded',
  TEMPLATE_SELECTED = 'template-selected',
  PROJECT_EXPORTED = 'project-exported',
  ERROR_OCCURRED = 'error-occurred',
}

/**
 * 事件监听器类型
 */
export type EventListener<T = any> = (data: T) => void;

/**
 * 构建状态枚举
 */
export enum BuildStatus {
  IDLE = 'idle',
  INSTALLING = 'installing',
  BUILDING = 'building',
  RUNNING = 'running',
  FAILED = 'failed',
}

/**
 * 构建过程信息
 */
export interface BuildProcessInfo {
  /** 构建状态 */
  status: BuildStatus;
  /** 错误信息 */
  error?: string;
  /** 服务器URL */
  serverUrl?: string;
  /** 构建日志 */
  logs: string[];
  /** 构建开始时间 */
  startTime?: number;
  /** 构建结束时间 */
  endTime?: number;
  /** 构建进度（0-100） */
  progress?: number;
  /** 构建警告 */
  warnings?: string[];
}

/**
 * 编辑器设置接口
 */
export interface EditorSettings {
  /** 主题 */
  theme: 'light' | 'dark' | 'system';
  /** 字体大小 */
  fontSize: number;
  /** 字体系列 */
  fontFamily: string;
  /** 行高 */
  lineHeight: number;
  /** 是否显示行号 */
  showLineNumbers: boolean;
  /** 是否启用自动保存 */
  autoSave: boolean;
  /** 自动保存延迟（毫秒） */
  autoSaveDelay: number;
  /** 是否启用代码折叠 */
  folding: boolean;
  /** 是否启用自动配对括号 */
  autoClosingBrackets: boolean;
  /** 是否启用自动缩进 */
  autoIndent: boolean;
  /** 制表符大小 */
  tabSize: number;
  /** 是否使用空格代替制表符 */
  insertSpaces: boolean;
  /** 是否启用代码片段 */
  snippetsEnabled: boolean;
  /** 是否启用代码提示 */
  suggestionsEnabled: boolean;
  /** 是否启用格式化 */
  formatEnabled: boolean;
  /** 是否启用代码检查 */
  lintEnabled: boolean;
}

/**
 * 项目导出配置接口
 */
export interface ProjectExportConfig {
  /** 导出格式 */
  format: 'zip' | 'tar' | 'github';
  /** 是否包含node_modules */
  includeNodeModules: boolean;
  /** 是否包含构建产物 */
  includeBuildOutput: boolean;
  /** 是否包含隐藏文件 */
  includeHiddenFiles: boolean;
  /** 导出文件名 */
  fileName?: string;
  /** GitHub仓库信息（当format为github时使用） */
  githubConfig?: {
    /** 仓库名称 */
    repoName: string;
    /** 仓库描述 */
    description?: string;
    /** 是否为私有仓库 */
    isPrivate: boolean;
  };
}

/**
 * 错误类型枚举
 */
export enum ErrorType {
  /** 网络错误 */
  NETWORK = 'network',
  /** 文件系统错误 */
  FILE_SYSTEM = 'file-system',
  /** 构建错误 */
  BUILD = 'build',
  /** 依赖安装错误 */
  DEPENDENCY = 'dependency',
  /** 运行时错误 */
  RUNTIME = 'runtime',
  /** 权限错误 */
  PERMISSION = 'permission',
  /** 未知错误 */
  UNKNOWN = 'unknown',
}

/**
 * 错误信息接口
 */
export interface ErrorInfo {
  /** 错误类型 */
  type: ErrorType;
  /** 错误消息 */
  message: string;
  /** 错误代码 */
  code?: string;
  /** 错误详情 */
  details?: any;
  /** 错误时间 */
  timestamp: number;
  /** 是否致命错误 */
  isFatal: boolean;
  /** 建议的恢复操作 */
  recoveryActions?: string[];
}

/**
 * 恢复操作接口
 */
export interface RecoveryAction {
  /** 操作ID */
  id: string;
  /** 操作名称 */
  name: string;
  /** 操作描述 */
  description: string;
  /** 执行操作的函数 */
  execute: () => Promise<boolean>;
  /** 操作是否自动执行 */
  autoExecute: boolean;
}

/**
 * 模板过滤选项接口
 */
export interface TemplateFilterOptions {
  /** 按框架过滤 */
  framework?: string[];
  /** 按语言过滤 */
  language?: string[];
  /** 按标签过滤 */
  tags?: string[];
  /** 按分类过滤 */
  category?: TemplateCategory[];
  /** 按难度过滤 */
  difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
  /** 搜索关键词 */
  searchTerm?: string;
}

/**
 * 代码片段接口
 */
export interface CodeSnippet {
  /** 片段ID */
  id: string;
  /** 片段名称 */
  name: string;
  /** 片段描述 */
  description: string;
  /** 片段内容 */
  content: string;
  /** 适用语言 */
  language: string;
  /** 触发前缀 */
  prefix: string;
  /** 片段标签 */
  tags?: string[];
}

/**
 * 构建配置接口
 */
export interface BuildConfig {
  /** 构建命令 */
  command: string;
  /** 构建输出目录 */
  outputDir: string;
  /** 环境变量 */
  env?: Record<string, string>;
  /** 构建参数 */
  args?: string[];
  /** 是否启用优化 */
  optimize?: boolean;
  /** 是否生成源码映射 */
  sourceMap?: boolean;
  /** 是否压缩 */
  minify?: boolean;
}

/**
 * 依赖安装配置接口
 */
export interface DependencyInstallConfig {
  /** 是否使用缓存 */
  useCache: boolean;
  /** 是否安装开发依赖 */
  includeDev: boolean;
  /** 包管理器 */
  packageManager: 'npm' | 'yarn' | 'pnpm';
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 镜像源 */
  mirror?: string;
}

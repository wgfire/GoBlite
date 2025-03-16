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
}

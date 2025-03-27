// WebContainer 状态枚举
export enum WebContainerStatus {
  EMPTY = 'empty',         // 初始空状态
  INITIALIZING = 'initializing', // 初始化中
  RUNNING = 'running',     // 运行中
  STOPPED = 'stopped',     // 已停止
  ERROR = 'error'          // 错误状态
}

// WebContainer 属性接口
export interface WebContainerProps {
  isVisible: boolean;
}

// 预览区域属性接口
export interface PreviewAreaProps {
  url?: string;
  isRunning?: boolean;
  onRefresh?: () => void;
  onStop?: () => void;
}

// 终端区域属性接口
export interface TerminalAreaProps {
  isExpanded?: boolean;
  onToggle?: () => void;
  isRunning?: boolean;
}

// 终端标签接口
export interface TerminalTab {
  id: string;
  name: string;
  content: string[];
}

// 空状态属性接口
export interface EmptyStateProps {
  onStart: () => void;
}

// 视图模式类型
export type ViewMode = 'desktop' | 'tablet' | 'mobile';

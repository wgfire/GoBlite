// WebContainer 状态枚举
export enum WebContainerStatus {
  EMPTY = 'empty',         // 初始空状态
  INITIALIZING = 'initializing', // 初始化中
  RUNNING = 'running',     // 运行中
  STOPPED = 'stopped',     // 已停止
  ERROR = 'error'          // 错误状态
}

// 终端标签接口
export interface TerminalTab {
  id: string;
  name: string;
  content: string[];
}

// 视图模式类型
export type ViewMode = 'desktop' | 'tablet' | 'mobile';

// WebContainer 核心状态接口
export interface WebContainerState {
  status: WebContainerStatus;
  errorMessage?: string;
  isVisible: boolean;
}

// 预览状态接口
export interface PreviewState {
  url: string;
  viewMode: ViewMode;
  isLoading: boolean;
}

// 终端状态接口
export interface TerminalState {
  tabs: TerminalTab[];
  activeTabId: string;
  isExpanded: boolean;
}

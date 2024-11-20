export interface MousePosition {
  mouseX: number;
  mouseY: number;
}
export interface Position {
  x: number;
  y: number;
}
export interface ElementInfo {
  target: HTMLElement | null;
  parent: HTMLElement | null; // 元素移动过程中，需要更新父元素
  rect?: DOMRect;
  parentRect?: DOMRect;
  matrix?: DOMMatrix | null;
}

export type Events = {
  mouseDrag: MousePosition & ElementInfo & Position;
  mouseUp: Position;
  mouseDown: MousePosition & ElementInfo;
  doubleClick: { id: string };
  contextMenu: { e: React.MouseEvent<HTMLDivElement, MouseEvent> };
  guides: { guides: unknown[] };
};

// 优先级枚举
export enum Priority {
  HIGH = 1,
  NORMAL = 2,
  LOW = 3
}
// 事件名称类型
export type EventName = keyof Events;

// 事件处理函数类型
export type EventHandler<T extends EventName> = (event: Events[T]) => void;

// 事件处理器映射类型
export type EventHandlers = {
  [K in EventName]?: EventHandler<K>;
};

// Hook 配置接口
export interface HookConfig {
  id: string;
  handlers: EventHandlers;
  priority?: Priority;
  errorHandler?: (error: Error, eventName: EventName) => void;
}

// 性能指标接口
export interface PerformanceMetrics {
  eventName: EventName;
  hookId: string;
  executionTime: number;
  timestamp: number;
  success: boolean;
  error?: Error;
}

// 事件管理器返回类型
export interface EventManagerReturn {
  registerHook: (hookConfig: HookConfig) => void;
  registerHooks: (hooks: HookConfig[]) => void;
  unregisterHook: (hookId: string) => void;
  unregisterAllHooks: () => void;
  getPerformanceMetrics: () => PerformanceMetrics[];
  getAverageExecutionTime: (eventName: EventName) => number;
  getErrorRate: (eventName: EventName) => number;
}

// 定义运行时可用的事件名称常量
export const EVENT_NAMES = {
  MOUSE_DRAG: "mouseDrag",
  MOUSE_UP: "mouseUp",
  DOUBLE_CLICK: "doubleClick",
  CONTEXT_MENU: "contextMenu",
  MOUSE_DOWN: "mouseDown"
  // ... 其他事件
} as const;

// 创建运行时事件名称数组
export const EVENT_NAMES_ARRAY = Object.values(EVENT_NAMES);

// 定义事件映射接口，允许不同事件类型使用不同的数据结构
export interface EventMap {
  [key: string]: unknown;
}

// 定义插件中使用的事件映射
export interface MyEventMap extends EventMap {
  init: void;
  FigmaPreview: string[];
  parseToHtml: SceneNode[];
  parseToJson: SceneNode[];
  exportImages: string[];
  parseToImage: SceneNode[];
}

// 定义事件处理器类型，接收单一数据参数
type EventHandler<T> = (data: T) => void | Promise<void>;

// 事件存储接口
type Events<T extends EventMap> = {
  [K in keyof T]?: Array<EventHandler<T[K]>>;
};

/**
 * 事件管理器类，用于处理插件内部的事件通信
 * @template T 事件映射类型，定义了事件名称到事件数据类型的映射
 */
export class EventManager<T extends EventMap = EventMap> {
  // 将 events 改为 protected，以便可以在类型检查中访问
  protected events: Events<T> = {} as Events<T>;
  private readonly debug: boolean;

  /**
   * 创建一个新的事件管理器实例
   * @param options 配置选项
   */
  constructor(options: { debug?: boolean } = {}) {
    this.debug = options.debug || false;
  }

  /**
   * 注册事件处理程序
   * @param eventType 事件类型
   * @param handler 事件处理函数
   */
  public addHandler<K extends keyof T>(eventType: K, handler: EventHandler<T[K]>): void {
    if (!this.events[eventType]) {
      this.events[eventType] = [] as Array<EventHandler<T[K]>>;
    }

    (this.events[eventType] as Array<EventHandler<T[K]>>).push(handler);

    if (this.debug) {
      console.log(`[EventManager] 已注册事件处理器: ${String(eventType)}`);
    }
  }

  /**
   * 移除事件处理程序
   * @param eventType 事件类型
   * @param handler 要移除的事件处理函数
   */
  public removeHandler<K extends keyof T>(eventType: K, handler: EventHandler<T[K]>): void {
    const handlers = this.events[eventType];
    if (!handlers) return;

    this.events[eventType] = handlers.filter(h => h !== handler) as Array<EventHandler<T[K]>>;

    if (this.debug) {
      console.log(`[EventManager] 已移除事件处理器: ${String(eventType)}`);
    }
  }

  /**
   * 触发事件
   * @param eventType 事件类型
   * @param data 事件数据
   */
  public async trigger<K extends keyof T>(eventType: K, data: T[K]): Promise<void> {
    const handlers = this.events[eventType];

    if (!handlers || handlers.length === 0) {
      if (this.debug) {
        console.log(`[EventManager] 没有找到事件处理器: ${String(eventType)}`);
      }
      return;
    }

    if (this.debug) {
      console.log(`[EventManager] 触发事件: ${String(eventType)}`, data);
    }

    // 复制处理器数组，防止在执行过程中修改数组导致的问题
    const handlersToExecute = [...handlers];

    for (const handler of handlersToExecute) {
      try {
        await handler(data);
      } catch (error) {
        console.error(`[EventManager] 事件处理器执行错误 (${String(eventType)}):`, error);
      }
    }
  }

  /**
   * 检查是否有指定事件类型的处理器
   * @param eventType 事件类型
   * @returns 是否有该事件类型的处理器
   */
  public hasHandlers<K extends keyof T>(eventType: K): boolean {
    const handlers = this.events[eventType];
    return !!handlers && handlers.length > 0;
  }

  /**
   * 检查是否存在指定事件类型的处理器
   * @param eventType 事件类型
   * @returns 是否存在
   */
  public hasEvent(eventType: keyof T): boolean {
    return (
      eventType in this.events && Array.isArray(this.events[eventType]) && (this.events[eventType]?.length ?? 0) > 0
    );
  }

  /**
   * 清除所有事件处理器
   */
  public clearHandlers(): void {
    this.events = {} as Events<T>;
    if (this.debug) {
      console.log("[EventManager] 已清除所有事件处理器");
    }
  }

  /**
   * 清除特定事件类型的所有处理器
   * @param eventType 事件类型
   */
  public clearEventHandlers<K extends keyof T>(eventType: K): void {
    if (eventType in this.events) {
      this.events[eventType] = [] as Array<EventHandler<T[K]>>;
      if (this.debug) {
        console.log(`[EventManager] 已清除事件类型的所有处理器: ${String(eventType)}`);
      }
    }
  }
}

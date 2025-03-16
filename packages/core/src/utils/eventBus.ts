import { EventType, EventListener } from '../types';

/**
 * 事件总线，用于组件间通信
 */
export class EventBus {
  private static instance: EventBus;
  private listeners: Map<EventType, Set<EventListener>>;

  private constructor() {
    this.listeners = new Map();
  }

  /**
   * 获取事件总线单例
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * 注册事件监听器
   * @param event 事件类型
   * @param callback 回调函数
   */
  public on<T>(event: EventType, callback: EventListener<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * 移除事件监听器
   * @param event 事件类型
   * @param callback 要移除的回调函数
   */
  public off<T>(event: EventType, callback: EventListener<T>): void {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.delete(callback);
  }

  /**
   * 触发事件
   * @param event 事件类型
   * @param data 事件数据
   */
  public emit<T>(event: EventType, data: T): void {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for event ${event}:`, error);
      }
    });
  }

  /**
   * 清除所有监听器
   */
  public clear(): void {
    this.listeners.clear();
  }
}

// 导出单例实例
export const eventBus = EventBus.getInstance();

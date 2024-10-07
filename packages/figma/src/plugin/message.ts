type EventHandler<T = unknown> = (...args: T[]) => void | Promise<void>;
interface Events<T> {
  [key: string]: EventHandler<T>[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventManager<T = any> {
  private events: Events<T> = {};

  // 注册事件处理程序
  public addHandler(eventType: string, handler: EventHandler<T>): void {
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }
    this.events[eventType].push(handler);
  }

  // 移除事件处理程序
  public removeHandler(eventType: string, handler: EventHandler<T>): void {
    if (!this.events[eventType]) return;
    this.events[eventType] = this.events[eventType].filter(h => h !== handler);
  }

  // 触发事件
  public async trigger(eventType: string, ...args: T[]): Promise<void> {
    if (!this.events[eventType]) return;
    for (const handler of this.events[eventType]) {
      await handler(...args);
    }
  }
}

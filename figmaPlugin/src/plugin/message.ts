type EventHandler = (...args: unknown[]) => void | Promise<void>;

export class EventManager {
  private events: { [key: string]: EventHandler[] } = {};

  // 注册事件处理程序
  public addHandler(eventType: string, handler: EventHandler): void {
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }
    this.events[eventType].push(handler);
  }

  // 移除事件处理程序
  public removeHandler(eventType: string, handler: EventHandler): void {
    if (!this.events[eventType]) return;
    this.events[eventType] = this.events[eventType].filter(h => h !== handler);
  }

  // 触发事件
  public async trigger(eventType: string, ...args: unknown[]): Promise<void> {
    if (!this.events[eventType]) return;
    for (const handler of this.events[eventType]) {
      await handler(...args);
    }
  }
}
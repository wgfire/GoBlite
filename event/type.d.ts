// 定义事件处理函数的类型
export type EventHandler = (event: EventContext) => void;

// 事件上下文接口，包含事件相关的数据
export interface EventContext {
  // 事件名称
  eventName: string;
  // 事件触发的目标元素
  target: HTMLElement;
  // 事件附带的数据
  data?: any;
}

// 事件脚本接口
export interface EventScript {
  // 事件名称
  name: string;
  // 事件描述
  description: string;
  // 事件版本
  version: string;
  // 事件处理函数
  handler: EventHandler;
}

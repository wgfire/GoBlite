/* eslint-disable @typescript-eslint/no-explicit-any */
import { eventBus, BusinessEventPayload, BusinessEventTypes } from "./eventBus";

/**
 * 业务事件管理器
 * 提供简化的API来触发和监听业务事件
 */
export const BusinessEvents = {
  /**
   * 触发业务事件
   * @param eventName 事件名称
   * @param payload 事件数据
   */
  emit<K extends keyof BusinessEventTypes>(
    eventName: K,
    payload?: Omit<BusinessEventTypes[K], keyof BusinessEventPayload>
  ): void {
    const fullPayload = {
      timestamp: Date.now(),
      source: "design",
      ...(payload || undefined)
    } as unknown as BusinessEventTypes[K];

    eventBus.emit(eventName as any, fullPayload as any);
  },

  /**
   * 监听业务事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  on<K extends keyof BusinessEventTypes>(eventName: K, handler: (data: BusinessEventTypes[K]) => void): void {
    eventBus.on(eventName, handler);
  },

  /**
   * 取消监听业务事件
   * @param eventName 事件名称
   * @param handler 事件处理函数
   */
  off<K extends keyof BusinessEventTypes>(eventName: K, handler?: (data: BusinessEventTypes[K]) => void): void {
    eventBus.off(eventName, handler);
  },

  /**
   * 监听所有业务事件
   * @param handler 事件处理函数
   */
  onAll(handler: (type: string, data: any) => void): void {
    eventBus.on("*", handler as any);
  },

  /**
   * 取消监听所有业务事件
   * @param handler 事件处理函数
   */
  offAll(handler: (type: string, data: any) => void): void {
    eventBus.off("*", handler as any);
  }
};

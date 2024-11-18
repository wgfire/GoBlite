import { useEffect, useRef, useCallback } from "react";
import mitt from "@/utils/mitt";
import { EventName, HookConfig, Priority, Events, EVENT_NAMES_ARRAY } from "./type";
import { updateEventVariable } from "./useEventVariable";
export const eventBus = mitt<Events>();
export const useEventManager = (initialHooks: HookConfig[] = []) => {
  const registryRef = useRef<{
    hooks: Map<string, HookConfig>;
  }>({
    hooks: new Map()
  });

  // 获取指定事件的所有处理器（按优先级排序）
  const getEventHandlers = useCallback(<T extends EventName>(eventName: T) => {
    return Array.from(registryRef.current.hooks.values())
      .filter(hook => hook.handlers[eventName])
      .map(hook => ({
        hookId: hook.id,
        handler: hook.handlers[eventName],
        priority: hook.priority ?? Priority.NORMAL,
        errorHandler: hook.errorHandler
      }))
      .sort((a, b) => a.priority - b.priority);
  }, []);

  // 注册单个 hook
  const registerHook = useCallback((hookConfig: HookConfig) => {
    const { id } = hookConfig;

    // 保存 hook
    registryRef.current.hooks.set(id, hookConfig);
  }, []);

  // 卸载单个 hook
  const unregisterHook = useCallback((hookId: string) => {
    registryRef.current.hooks.delete(hookId);
  }, []);

  // 事件处理函数
  const handleEvent = useCallback(
    <T extends EventName>(eventName: T, event: Events[T]) => {
      const handlers = getEventHandlers(eventName);
      updateEventVariable(eventName, event);
      handlers.forEach(({ hookId, handler, errorHandler }) => {
        try {
          requestAnimationFrame(() => {
            handler?.(event);
          });
        } catch (error) {
          errorHandler?.(error as Error, eventName);
          console.error(`Error in hook ${hookId} handling event ${eventName}:`, error);
        }
      });
    },
    [getEventHandlers]
  );

  // 注册多个 hooks
  const registerHooks = useCallback(
    (hooks: HookConfig[]) => {
      hooks.forEach(registerHook);
    },
    [registerHook]
  );

  // 卸载所有 hooks
  const unregisterAllHooks = useCallback(() => {
    registryRef.current.hooks.clear();
  }, []);

  // 初始化
  useEffect(() => {
    // 注册初始 hooks
    registerHooks(initialHooks);

    // 注册事件监听
    EVENT_NAMES_ARRAY.forEach(eventName => {
      eventBus.on(eventName, (event: Events[typeof eventName]) => {
        handleEvent(eventName, event);
      });
    });

    // 清理函数
    return () => {
      unregisterAllHooks();
      EVENT_NAMES_ARRAY.forEach(eventName => {
        eventBus.off(eventName);
      });
    };
  }, []);

  // 如果需要响应 initialHooks 的变化
  useEffect(() => {
    unregisterAllHooks();
    registerHooks(initialHooks);
  }, [initialHooks]);

  return {
    registerHook,
    registerHooks,
    unregisterHook,
    unregisterAllHooks
  };
};

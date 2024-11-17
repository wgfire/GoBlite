import { useState, useEffect, useCallback } from "react";

import { Events, eventBus } from "../utils/eventBus";

type HookFunction = (event: unknown) => void;
type Handler<T = unknown> = (event: T) => void;
interface Callback {
  hookName: string;
  hookFunc: HookFunction;
}

interface Callbacks {
  [key: string]: Callback[];
}

export const useCanvasSubscribe = () => {
  const [callbacks, setCallbacks] = useState<Callbacks>({});

  const register = useCallback((hookName: string, eventNames: (keyof Events)[], hookFunc: HookFunction) => {
    // 检查hooks是否满足注册条件
    if (typeof hookFunc !== "function") {
      throw new Error(`The hook function for ${hookName} must be a function.`);
    }

    setCallbacks(prev => {
      const newCallbacks = { ...prev };
      eventNames.forEach(eventName => {
        if (!newCallbacks[eventName]) {
          newCallbacks[eventName] = [];
        }
        newCallbacks[eventName].push({
          hookName,
          hookFunc
        });
      });
      return newCallbacks;
    });
  }, []);

  const unregister = useCallback((hookName: string) => {
    setCallbacks(prev => {
      const newCallbacks = { ...prev };
      Object.keys(newCallbacks).forEach(eventName => {
        newCallbacks[eventName] = newCallbacks[eventName].filter(callback => callback.hookName !== hookName);
      });
      return newCallbacks;
    });
  }, []);

  useEffect(() => {
    const handleEvent =
      (eventName: keyof Events): Handler<Events[keyof Events]> =>
      event => {
        if (callbacks[eventName]) {
          callbacks[eventName].forEach(callback => {
            callback.hookFunc(event);
          });
        }
      };

    const eventHandlers: { [K in keyof Events]?: Handler<Events[K]> } = {};

    Object.keys(callbacks).forEach(eventName => {
      const handler = handleEvent(eventName as keyof Events);
      eventHandlers[eventName as keyof Events] = handler;
      eventBus.on(eventName as keyof Events, handler);
    });

    // 在组件卸载时，注销所有的事件处理函数
    return () => {
      Object.keys(eventHandlers).forEach(eventName => {
        eventBus.off(eventName as keyof Events, eventHandlers[eventName as keyof Events]!);
      });
    };
  }, [callbacks]);

  return { eventBus, register, unregister };
};

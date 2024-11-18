import { useState, useEffect, useCallback } from "react";
import { isEqual } from "lodash-es";
import { EventName, Events } from "./type";

// 全局存储
const eventVariableStore = new Map<EventName, Events[EventName]>();
const listeners = new Map<EventName, Set<(value: Events[EventName]) => void>>();

// 更新事件参数
export const updateEventVariable = <T extends EventName>(eventName: T, value: Events[T]) => {
  eventVariableStore.set(eventName, value);
  listeners.get(eventName)?.forEach(listener => listener(value));
};

export function useEventVariable<T extends EventName>(eventName: T): Events[T] | undefined {
  const [value, setValue] = useState<Events[T] | undefined>(() => eventVariableStore.get(eventName) as Events[T]);

  const updateValue = useCallback((newValue: Events[T]) => {
    setValue(newValue);
  }, []);

  useEffect(() => {
    if (!listeners.has(eventName)) {
      listeners.set(eventName, new Set());
    }
    const eventListeners = listeners.get(eventName)!;
    eventListeners.add((value: unknown) => updateValue(value as Events[T]));

    // 初始值同步
    const currentValue = eventVariableStore.get(eventName) as Events[T];
    if (!isEqual(currentValue, value)) {
      setValue(currentValue);
    }
    return () => {
      eventListeners.delete((value: unknown) => updateValue(value as Events[T]));
      if (eventListeners.size === 0) {
        listeners.delete(eventName);
      }
    };
  }, [eventName, updateValue, value]);

  return value;
}

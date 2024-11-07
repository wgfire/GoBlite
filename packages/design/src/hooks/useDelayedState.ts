import { useState, useEffect } from "react";

interface UseDelayedStateOptions {
  delay?: number;
  immediate?: boolean;
}

/**
 * 处理延迟状态变化的 Hook
 * @param value 输入状态
 * @param options 配置选项
 * @returns 延迟后的状态
 */
export function useDelayedState(value: boolean, options: UseDelayedStateOptions = {}): [boolean] {
  const { delay = 300, immediate = true } = options;
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    if (immediate) {
      setDelayedValue(value);
    } else {
      const timer = setTimeout(() => {
        setDelayedValue(value);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [value, delay, immediate]);

  return [delayedValue];
}

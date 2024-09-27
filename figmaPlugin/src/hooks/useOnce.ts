import { useEffect, useRef } from 'react';

/**
 * 只在deps第一次变化时执行一次
 * @param {Function} fn
 * @param {ReadonlyArray<any>} deps
 * @returns {void}
 */
export const useOnce = <T extends ReadonlyArray<unknown>>(fn: () => void, deps: T) => {
  const isFirst = useRef(true);
  const prevDeps = useRef<T | undefined>(undefined);

  useEffect(() => {
    if (isFirst.current) {
      if (prevDeps.current) {
        // 检查依赖项是否发生了变化
        const hasChanged = prevDeps.current?.some((dep, index) => !Object.is(dep, deps[index]));
        if (hasChanged) {
          fn();
          isFirst.current = false; // 标记为已执行
        }
      } else {
        // 第一次渲染时存储依赖项
        prevDeps.current = deps;
      }
    }
  }, deps);
};

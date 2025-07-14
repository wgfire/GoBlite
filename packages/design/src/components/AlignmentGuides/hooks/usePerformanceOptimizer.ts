import { useRef } from "react";

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

interface OptimizationConfig {
  maxGuides: number;
  throttleDelay: number;
  enableVirtualization: boolean;
  prioritizeVisibleGuides: boolean;
}

export const usePerformanceOptimizer = () => {
  const metrics = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0
  });

  const lastUpdateTime = useRef<number>(0);
  const frameId = useRef<number>(0);

  const defaultConfig: OptimizationConfig = {
    maxGuides: 6, // 最多同时显示6条辅助线
    throttleDelay: 16, // 60fps
    enableVirtualization: true,
    prioritizeVisibleGuides: true
  };

  /**
   * 节流优化：限制更新频率
   */
  const throttledUpdate = (callback: () => void, delay: number = defaultConfig.throttleDelay) => {
    const now = performance.now();

    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }

    if (now - lastUpdateTime.current >= delay) {
      lastUpdateTime.current = now;
      callback();
    } else {
      frameId.current = requestAnimationFrame(() => {
        lastUpdateTime.current = performance.now();
        callback();
      });
    }
  };

  /**
   * 优化辅助线数量：根据重要性排序并限制数量
   */
  const optimizeGuides = <T extends { type: string; priority?: number }>(
    guides: T[],
    config: OptimizationConfig = defaultConfig
  ): T[] => {
    const startTime = performance.now();

    // 定义优先级权重
    const priorityWeights = {
      "snap-": 10, // 吸附线优先级最高
      "smart-": 8, // 智能距离线
      "parent-center": 6, // 父容器居中
      "center-center": 5, // 元素间居中对齐
      "left-left": 4,
      "right-right": 4,
      "top-top": 4,
      "bottom-bottom": 4,
      "left-right": 3,
      "right-left": 3,
      "top-bottom": 3,
      "bottom-top": 3,
      "vertical-": 2, // 基础垂直线
      "horizontal-": 2 // 基础水平线
    };

    // 计算每个辅助线的优先级分数
    const guidesWithPriority = guides.map(guide => {
      let priority = guide.priority || 0;

      // 根据类型调整优先级
      for (const [prefix, weight] of Object.entries(priorityWeights)) {
        if (guide.type.startsWith(prefix)) {
          priority += weight;
          break;
        }
      }

      return { ...guide, calculatedPriority: priority };
    });

    // 按优先级排序并限制数量
    const optimizedGuides = guidesWithPriority
      .sort((a, b) => b.calculatedPriority - a.calculatedPriority)
      .slice(0, config.maxGuides)
      .map(({ calculatedPriority: _, ...guide }) => guide);

    // 更新性能指标
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    metrics.current.renderCount++;
    metrics.current.lastRenderTime = renderTime;
    metrics.current.averageRenderTime =
      (metrics.current.averageRenderTime * (metrics.current.renderCount - 1) + renderTime) /
      metrics.current.renderCount;

    return optimizedGuides;
  };

  /**
   * 去重优化：移除重复或冲突的辅助线
   */
  const deduplicateGuides = <T extends { type: string; style: any }>(guides: T[]): T[] => {
    const seen = new Set<string>();
    const result: T[] = [];

    // 冲突类型映射：这些类型的辅助线不能同时显示
    const conflictGroups = [
      ["left-left", "left-right", "left-center"],
      ["right-right", "right-left", "right-center"],
      ["top-top", "top-bottom", "top-center"],
      ["bottom-bottom", "bottom-top", "bottom-center"],
      ["vertical-top", "smart-vertical-container-top"],
      ["horizontal-left", "smart-horizontal-container-left"],
      ["horizontal-right", "smart-horizontal-container-right"]
    ];

    const usedConflictTypes = new Set<string>();

    for (const guide of guides) {
      // 检查是否与已有的辅助线冲突
      let hasConflict = false;

      for (const group of conflictGroups) {
        if (group.includes(guide.type)) {
          const conflictInGroup = group.some(type => usedConflictTypes.has(type));
          if (conflictInGroup) {
            hasConflict = true;
            break;
          }
          usedConflictTypes.add(guide.type);
          break;
        }
      }

      // 生成位置键用于去重
      const positionKey = `${Math.round(guide.style.left || 0)}_${Math.round(guide.style.top || 0)}_${guide.type.split("-")[0]}`;

      if (!hasConflict && !seen.has(positionKey)) {
        seen.add(positionKey);
        result.push(guide);
      }
    }

    return result;
  };

  /**
   * 可见性优化：优先显示在视口内的辅助线
   */
  const prioritizeVisibleGuides = <T extends { style: any }>(guides: T[], containerRect: DOMRect): T[] => {
    return guides.sort((a, b) => {
      const aVisible = isGuideVisible(a.style, containerRect);
      const bVisible = isGuideVisible(b.style, containerRect);

      if (aVisible && !bVisible) return -1;
      if (!aVisible && bVisible) return 1;
      return 0;
    });
  };

  /**
   * 检查辅助线是否在可见区域内
   */
  const isGuideVisible = (style: any, containerRect: DOMRect): boolean => {
    const left = style.left || 0;
    const top = style.top || 0;
    const width = style.width || 1;
    const height = style.height || 1;

    return left < containerRect.width && left + width > 0 && top < containerRect.height && top + height > 0;
  };

  /**
   * 获取性能指标
   */
  const getMetrics = () => ({ ...metrics.current });

  /**
   * 重置性能指标
   */
  const resetMetrics = () => {
    metrics.current = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0
    };
  };

  /**
   * 完整的优化流程
   */
  const optimizeGuidesComplete = <T extends { type: string; style: any; priority?: number }>(
    guides: T[],
    containerRect: DOMRect,
    config: OptimizationConfig = defaultConfig
  ): T[] => {
    if (guides.length === 0) return guides;

    let optimizedGuides = guides;

    // 1. 去重
    optimizedGuides = deduplicateGuides(optimizedGuides);

    // 2. 可见性优先
    if (config.prioritizeVisibleGuides) {
      optimizedGuides = prioritizeVisibleGuides(optimizedGuides, containerRect);
    }

    // 3. 数量优化
    optimizedGuides = optimizeGuides(optimizedGuides, config);

    return optimizedGuides;
  };

  const cleanup = () => {
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
      frameId.current = 0;
    }
  };

  return {
    throttledUpdate,
    optimizeGuides,
    deduplicateGuides,
    prioritizeVisibleGuides,
    optimizeGuidesComplete,
    getMetrics,
    resetMetrics,
    cleanup
  };
};
